import { apiClient } from './client';
import type { BaseResponse, DataResponse, PaginatedResponse } from '@/types/api.types';
import type {
  Role,
  RoleDetail,
  CreateRolePayload,
  UpdateRolePayload,
  RoleListFilters,
} from '@/types/role.types';

export const rolesApi = {
  getAll: async (params: RoleListFilters): Promise<PaginatedResponse<Role>> => {
    const { data } = await apiClient.get<PaginatedResponse<Role>>('/admin/roles', { params });
    return data;
  },

  getById: async (id: number | string): Promise<RoleDetail> => {
    const { data } = await apiClient.get<DataResponse<RoleDetail>>(`/admin/roles/${id}`);
    return data.data;
  },

  create: async (payload: CreateRolePayload): Promise<BaseResponse> => {
    const { data } = await apiClient.post<BaseResponse>('/admin/roles', payload);
    return data;
  },

  update: async (id: number | string, payload: UpdateRolePayload): Promise<BaseResponse> => {
    const { data } = await apiClient.put<BaseResponse>(`/admin/roles/${id}`, payload);
    return data;
  },

  delete: async (id: number | string): Promise<BaseResponse> => {
    const { data } = await apiClient.delete<BaseResponse>(`/admin/roles/${id}`);
    return data;
  },
};