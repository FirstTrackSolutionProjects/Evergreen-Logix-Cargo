import { apiClient } from './client';
import type { DataResponse } from '@/types/api.types';
import type { Permission } from '@/types/role.types';

export const permissionsApi = {
  getAll: async (): Promise<Permission[]> => {
    const { data } = await apiClient.get<DataResponse<{ rows: Permission[] }>>('/admin/permissions');
    return data.data.rows;
  },
};