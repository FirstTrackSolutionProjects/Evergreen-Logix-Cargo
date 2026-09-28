import { apiClient } from './client';
import type { BaseResponse, DataResponse, PaginatedResponse } from '@/types/api.types';
import type {
  DeliveryPartner,
  CreateDeliveryPartnerPayload,
  UpdateDeliveryPartnerPayload,
  DeliveryPartnerListFilters,
  AssignShipmentsPayload,
} from '@/types/delivery-partner.types';

export const deliveryPartnersApi = {
  getAll: async (params: DeliveryPartnerListFilters): Promise<PaginatedResponse<DeliveryPartner>> => {
    const { data } = await apiClient.get<PaginatedResponse<DeliveryPartner>>('/admin/delivery-partners', { params });
    return data;
  },

  getById: async (id: number | string): Promise<DeliveryPartner> => {
    const { data } = await apiClient.get<DataResponse<DeliveryPartner>>(`/admin/delivery-partners/${id}`);
    return data.data;
  },

  create: async (payload: CreateDeliveryPartnerPayload): Promise<BaseResponse> => {
    const { data } = await apiClient.post<BaseResponse>('/admin/delivery-partners', payload);
    return data;
  },

  update: async (id: number | string, payload: UpdateDeliveryPartnerPayload): Promise<BaseResponse> => {
    const { data } = await apiClient.put<BaseResponse>(`/admin/delivery-partners/${id}`, payload);
    return data;
  },

  activate: async (id: number | string): Promise<BaseResponse> => {
    const { data } = await apiClient.patch<BaseResponse>(`/admin/delivery-partners/${id}/activate`);
    return data;
  },

  deactivate: async (id: number | string): Promise<BaseResponse> => {
    const { data } = await apiClient.patch<BaseResponse>(`/admin/delivery-partners/${id}/deactivate`);
    return data;
  },

  assignShipments: async (id: number | string, payload: AssignShipmentsPayload): Promise<BaseResponse> => {
    const { data } = await apiClient.post<BaseResponse>(`/admin/delivery-partners/${id}/assign-shipments`, payload);
    return data;
  },
};