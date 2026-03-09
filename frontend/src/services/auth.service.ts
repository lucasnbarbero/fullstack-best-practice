import api from '@/lib/api';
import type {
  AuthResponse,
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  VerifyEmailDto,
  ResendVerificationDto,
  MessageResponse,
  RefreshResponse,
  User,
} from '@/types';

export const authService = {
  /**
   * Registrar nuevo usuario
   */
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Iniciar sesión
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  /**
   * Cerrar sesión
   */
  async logout(): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('/auth/logout');
    return response.data;
  },

  /**
   * Refrescar tokens
   */
  async refreshTokens(refreshToken: string): Promise<RefreshResponse> {
    const response = await api.post<RefreshResponse>('/auth/refresh', { refreshToken });
    return response.data;
  },

  /**
   * Solicitar recuperación de contraseña
   */
  async forgotPassword(data: ForgotPasswordDto): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('/auth/forgot-password', data);
    return response.data;
  },

  /**
   * Restablecer contraseña con token
   */
  async resetPassword(data: ResetPasswordDto): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('/auth/reset-password', data);
    return response.data;
  },

  /**
   * Cambiar contraseña (usuario autenticado)
   */
  async changePassword(data: ChangePasswordDto): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('/auth/change-password', data);
    return response.data;
  },

  /**
   * Verificar email con token
   */
  async verifyEmail(data: VerifyEmailDto): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('/auth/verify-email', data);
    return response.data;
  },

  /**
   * Reenviar email de verificación
   */
  async resendVerification(data: ResendVerificationDto): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('/auth/resend-verification', data);
    return response.data;
  },

  /**
   * Obtener perfil del usuario actual
   */
  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },
};

export default authService;
