export interface SignUpRequest {
  username: string
  email: string
  password: string
}

export interface SignUpResponse {
  message: string
  email: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface VerifyOtpRequest {
  email: string
  code: string
}

export interface ResendOtpRequest {
  email: string
}

export interface AuthResponse {
  token: string
  expiresAt: string
  username: string
  role: string
}
