export interface Role {
  id: number;
  title: string;
}

export interface RoleDetail extends Role {
  permissions: string[];
}

export interface Permission {
  id: string;
  name: string;
}

export interface CreateRolePayload {
  title: string;
  permissions: string[];
}

export interface UpdateRolePayload {
  title?: string;
  permissions?: string[];
}

export interface RoleListFilters {
  identifier?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}