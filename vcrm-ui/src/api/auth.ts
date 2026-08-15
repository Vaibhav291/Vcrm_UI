import { apiClient } from './client'
import type {
  AuthResponse,
  LoginRequest,
  ResendOtpRequest,
  SignUpRequest,
  SignUpResponse,
  VerifyOtpRequest,
} from '../types/auth'

export const authApi = {
  signUp: (request: SignUpRequest) => apiClient.post<SignUpResponse>('/Auth/signup', request),
  verifyOtp: (request: VerifyOtpRequest) => apiClient.post<AuthResponse>('/Auth/verify-otp', request),
  resendOtp: (request: ResendOtpRequest) =>
    apiClient.post<{ message: string }>('/Auth/resend-otp', request),
  login: (request: LoginRequest) => apiClient.post<AuthResponse>('/Auth/login', request),
}
