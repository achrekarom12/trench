export interface CreateUserInput {
  email: string
  password: string
  name: string
}

export interface LoginInput {
  email: string
  password: string
  rememberMe?: boolean
}

export interface ForgotPasswordInput {
  email: string
}

export interface ResetPasswordInput {
  token: string
  password: string
}

export interface User {
  id: string
  email: string
  name: string
  password: string
  createdAt: Date
  isDeleted: boolean
  deletedAt?: Date
}

export interface PasswordResetToken {
  id: string
  userId: string
  token: string
  expiresAt: Date
  used: boolean
}

export interface AuthResponse {
  success: boolean
  user?: Omit<User, 'password'>
  token?: string
  error?: string
  message?: string
}

export interface JWTUser {
  id: string
  email: string
  name: string
}
