import { apiClient } from './client';
import type { BaseResponse, DataResponse, PaginatedResponse } from '@/types/api.types';
import type {
  Shipment,
  ShipmentWithDeliveryPartner,
  ShipmentTrackingResponse,
  ShipmentPodResponse,
  CreateShipmentPayload,
  ShipmentListFilters,
  TakeNdrActionPayload,
} from '@/types/shipment.types';

export const shipmentsApi = {
  getAll: async (params: ShipmentListFilters): Promise<PaginatedResponse<ShipmentWithDeliveryPartner>> => {
    const { data } = await apiClient.get<PaginatedResponse<ShipmentWithDeliveryPartner>>('/admin/shipments', {
      params,
    });
    return data;
  },

  getById: async (id: number | string): Promise<Shipment> => {
    const { data } = await apiClient.get<DataResponse<Shipment>>(`/admin/shipments/${id}`);
    return data.data;
  },

  create: async (payload: CreateShipmentPayload): Promise<BaseResponse> => {
    const { data } = await apiClient.post<BaseResponse>('/admin/shipments', payload);
    return data;
  },

  update: async (id: number | string, payload: Partial<CreateShipmentPayload>): Promise<BaseResponse> => {
    const { data } = await apiClient.put<BaseResponse>(`/admin/shipments/${id}`, payload);
    return data;
  },

  cancel: async (id: number | string): Promise<BaseResponse> => {
    const { data } = await apiClient.patch<BaseResponse>(`/admin/shipments/${id}/cancel`);
    return data;
  },

  track: async (id: number | string): Promise<ShipmentTrackingResponse> => {
    const { data } = await apiClient.get<DataResponse<ShipmentTrackingResponse>>(`/admin/shipments/${id}/track`);
    return data.data;
  },

  takeNdrAction: async (id: number | string, payload: TakeNdrActionPayload): Promise<BaseResponse> => {
    const { data } = await apiClient.post<BaseResponse>(`/admin/shipments/${id}/ndr-action`, payload);
    return data;
  },

  getPod: async (id: number | string): Promise<ShipmentPodResponse> => {
    const { data } = await apiClient.get<DataResponse<ShipmentPodResponse>>(`/admin/shipments/${id}/pod`);
    return data.data;
  },

  getNdrReport: async (id: number | string): Promise<{ reason: string }> => {
    const { data } = await apiClient.get<DataResponse<{ reason: string }>>(`/admin/shipments/${id}/ndr-report`);
    return data.data;
  },
};