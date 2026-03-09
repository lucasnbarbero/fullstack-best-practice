import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../../users/services/users.service';
import { TokenService, TokenPair } from './token.service';
import { EmailService } from '../../email/services/email.service';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  VerifyEmailDto,
  ResendVerificationDto,
} from '../dto';
import { User } from '../../users/entities/user.entity';

export interface AuthResponse {
  user: Partial<User>;
  tokens: TokenPair;
}

@Injectable()
export class AuthService {
  private readonly saltRounds: number;
  private readonly passwordResetExpiresInMinutes: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {
    const saltRoundsEnv = this.configService.get<string>('BCRYPT_SALT_ROUNDS');
    this.saltRounds = saltRoundsEnv ? parseInt(saltRoundsEnv, 10) : 10;
    
    const resetExpiresEnv = this.configService.get<string>('PASSWORD_RESET_EXPIRES_MINUTES');
    this.passwordResetExpiresInMinutes = resetExpiresEnv ? parseInt(resetExpiresEnv, 10) : 60;
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      this.saltRounds,
    );

    const emailVerificationToken = uuidv4();

    const user = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      emailVerificationToken,
    });

    // Enviar email de verificación
    await this.emailService.sendVerificationEmail(
      user.email,
      user.firstName,
      emailVerificationToken,
    );

    const tokens = await this.tokenService.generateTokenPair(user);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const tokens = await this.tokenService.generateTokenPair(user);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.tokenService.revokeRefreshToken(refreshToken);
  }

  async logoutAll(userId: string): Promise<void> {
    await this.tokenService.revokeAllUserTokens(userId);
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    return this.tokenService.refreshAccessToken(refreshToken);
  }

  async getProfile(userId: string): Promise<Partial<User>> {
    const user = await this.usersService.findById(userId);
    return this.sanitizeUser(user);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);

    if (!user) {
      // No revelamos si el email existe o no por seguridad
      return;
    }

    const resetToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.passwordResetExpiresInMinutes);

    await this.usersService.setPasswordResetToken(user.id, resetToken, expiresAt);

    // Enviar email con token de recuperación
    await this.emailService.sendPasswordResetEmail(
      user.email,
      user.firstName,
      resetToken,
    );
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const user = await this.usersService.findByPasswordResetToken(
      resetPasswordDto.token,
    );

    if (!user) {
      throw new BadRequestException('Token inválido o expirado');
    }

    if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Token expirado');
    }

    const hashedPassword = await bcrypt.hash(
      resetPasswordDto.newPassword,
      this.saltRounds,
    );

    await this.usersService.updatePassword(user.id, hashedPassword);

    // Revocar todos los tokens de refresco del usuario
    await this.tokenService.revokeAllUserTokens(user.id);

    // Notificar al usuario que su contraseña fue cambiada
    await this.emailService.sendPasswordChangedEmail(user.email, user.firstName);
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.usersService.findById(userId);

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    const hashedPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      this.saltRounds,
    );

    await this.usersService.updatePassword(user.id, hashedPassword);

    // Revocar todos los tokens de refresco excepto el actual
    await this.tokenService.revokeAllUserTokens(userId);
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<void> {
    const user = await this.usersService.findByEmailVerificationToken(
      verifyEmailDto.token,
    );

    if (!user) {
      throw new BadRequestException('Token de verificación inválido');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('El email ya está verificado');
    }

    await this.usersService.markEmailAsVerified(user.id);
  }

  async resendVerification(
    resendVerificationDto: ResendVerificationDto,
  ): Promise<void> {
    const user = await this.usersService.findByEmail(resendVerificationDto.email);

    if (!user) {
      // No revelamos si el email existe o no
      return;
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('El email ya está verificado');
    }

    const newToken = uuidv4();
    await this.usersService.update(user.id, {
      emailVerificationToken: newToken,
    });

    // Enviar email de verificación
    await this.emailService.sendVerificationEmail(
      user.email,
      user.firstName,
      newToken,
    );
  }

  private sanitizeUser(user: User): Partial<User> {
    const { password, emailVerificationToken, passwordResetToken, passwordResetExpires, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
