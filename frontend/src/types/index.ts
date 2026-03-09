// Tipos base
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
}

export interface Role {
  id: string;
  name: RoleType;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  createdAt: string;
}

export type RoleType = 'ADMIN' | 'MODERATOR' | 'USER';

// Tokens
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

// Auth responses
export interface AuthResponse {
  user: User;
  tokens: Tokens;
}

export interface RefreshResponse {
  tokens: Tokens;
}

export interface MessageResponse {
  message: string;
}

// Auth DTOs
export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface VerifyEmailDto {
  token: string;
}

export interface ResendVerificationDto {
  email: string;
}

// API Error
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}
