export interface Admin {
  id: number;
  generated_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  email: string;
  is_superadmin: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminDetail extends Admin {
  role_ids?: number[];
}

export interface CreateAdminPayload {
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  email: string;
  role_ids: number[];
}

export interface UpdateAdminPayload {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  role_ids?: number[];
}

export interface UpdateAdminRolesPayload {
  role_ids: number[];
}

export interface AdminListFilters {
  identifier?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}