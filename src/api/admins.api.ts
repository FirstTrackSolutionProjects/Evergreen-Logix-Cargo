import { apiClient } from './client';
import type { BaseResponse, DataResponse, PaginatedResponse } from '@/types/api.types';
import type { Role } from '@/types/role.types';
import type {
  Admin,
  AdminDetail,
  CreateAdminPayload,
  UpdateAdminPayload,
  UpdateAdminRolesPayload,
  AdminListFilters,
} from '@/types/admin.types';

export const adminsApi = {
  getAll: async (params: AdminListFilters): Promise<PaginatedResponse<Admin>> => {
    const { data } = await apiClient.get<PaginatedResponse<Admin>>('/admin/admins', { params });
    return data;
  },

  getById: async (id: number | string): Promise<AdminDetail> => {
    const { data } = await apiClient.get<DataResponse<AdminDetail>>(`/admin/admins/${id}`);
    return data.data;
  },

  create: async (payload: CreateAdminPayload): Promise<BaseResponse> => {
    const { data } = await apiClient.post<BaseResponse>('/admin/admins', payload);
    return data;
  },

  update: async (id: number | string, payload: UpdateAdminPayload): Promise<BaseResponse> => {
    const { data } = await apiClient.put<BaseResponse>(`/admin/admins/${id}`, payload);
    return data;
  },

  activate: async (id: number | string): Promise<BaseResponse> => {
    const { data } = await apiClient.patch<BaseResponse>(`/admin/admins/${id}/activate`);
    return data;
  },

  deactivate: async (id: number | string): Promise<BaseResponse> => {
    const { data } = await apiClient.patch<BaseResponse>(`/admin/admins/${id}/deactivate`);
    return data;
  },

  updateRoles: async (id: number | string, payload: UpdateAdminRolesPayload): Promise<BaseResponse> => {
    const { data } = await apiClient.put<BaseResponse>(`/admin/admins/${id}/roles`, payload);
    return data;
  },

  getMyProfile: async () => {
    const { data } = await apiClient.get<DataResponse<{admin: Admin, roles: Role[]}>>('/admin/admins/me/profile');
    return data.data;
  },

  getMyRoles: async (): Promise<{ role_ids: number[] }> => {
    const { data } = await apiClient.get<DataResponse<{ role_ids: number[] }>>('/admin/admins/me/roles');
    return data.data;
  },

  getMyPermissions: async (): Promise<{ permission_ids: string[] }> => {
    const { data } = await apiClient.get<DataResponse<{ permission_ids: string[] }>>('/admin/admins/me/permissions');
    return data.data;
  },
};