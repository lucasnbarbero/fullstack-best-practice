import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RefreshToken } from '../entities/refresh-token.entity';
import { User } from '../../users/entities/user.entity';
import { JwtPayload } from '../strategies/jwt.strategy';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class TokenService {
  private readonly refreshTokenExpiresIn: number;

  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const refreshExpiresEnv = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN_DAYS');
    this.refreshTokenExpiresIn = refreshExpiresEnv ? parseInt(refreshExpiresEnv, 10) : 7;
  }

  async generateTokenPair(user: User): Promise<TokenPair> {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = await this.createRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async createRefreshToken(userId: string): Promise<string> {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.refreshTokenExpiresIn);

    const refreshToken = this.refreshTokenRepository.create({
      token,
      userId,
      expiresAt,
    });

    await this.refreshTokenRepository.save(refreshToken);

    return token;
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenPair> {
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: ['user'],
    });

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    if (storedToken.isRevoked) {
      throw new UnauthorizedException('Refresh token ha sido revocado');
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token ha expirado');
    }

    if (!storedToken.user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Revocar el token actual
    await this.revokeRefreshToken(refreshToken);

    // Generar nuevos tokens
    return this.generateTokenPair(storedToken.user);
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { token },
      { isRevoked: true },
    );
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { userId, isRevoked: false },
      { isRevoked: true },
    );
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.refreshTokenRepository.delete({
      expiresAt: LessThan(new Date()),
    });
  }
}
