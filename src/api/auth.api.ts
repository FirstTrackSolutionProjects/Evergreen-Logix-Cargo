import { apiClient } from './client';
import type { DataResponse, BaseResponse } from '@/types/api.types';
import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
  ChangePasswordRequest,
  ResetPasswordRequest,
  SendResetPasswordOtpRequest,
} from '@/types/auth.types';

export const authApi = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const { data } = await apiClient.post<DataResponse<LoginResponse>>('/admin/auth/login', payload);
    return data.data;
  },

  verifyToken: async (): Promise<{ user: AuthUser }> => {
    const { data } = await apiClient.get<DataResponse<{ user: AuthUser }>>('/admin/auth/verify');
    return data.data;
  },

  sendResetPasswordOtp: async (payload: SendResetPasswordOtpRequest): Promise<BaseResponse> => {
    const { data } = await apiClient.post<BaseResponse>('/admin/auth/reset-password/send-otp', payload);
    return data;
  },

  resetPassword: async (payload: ResetPasswordRequest): Promise<BaseResponse> => {
    const { data } = await apiClient.post<BaseResponse>('/admin/auth/reset-password', payload);
    return data;
  },

  changePassword: async (payload: ChangePasswordRequest): Promise<BaseResponse> => {
    const { data } = await apiClient.post<BaseResponse>('/admin/auth/change-password', payload);
    return data;
  },
};