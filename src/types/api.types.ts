export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface Pagination {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  currentCount: number;
}

export interface PaginatedData<T> {
  pagination: Pagination;
  rows: T[];
}

export interface PaginatedResponse<T> extends BaseResponse {
  data: PaginatedData<T>;
}

export interface DataResponse<T> extends BaseResponse {
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  statusCode?: number;
}

export interface ListQueryParams {
  identifier?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}