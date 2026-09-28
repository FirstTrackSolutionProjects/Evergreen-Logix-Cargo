import { apiClient } from './client';
import type { BaseResponse, DataResponse } from '@/types/api.types';
import type { BulkShipmentUploadUrl } from '@/types/shipment.types';

export const bulkShipmentsApi = {
  getKeyAndUploadUrl: async (): Promise<BulkShipmentUploadUrl> => {
    const { data } = await apiClient.get<DataResponse<BulkShipmentUploadUrl>>(
      '/admin/bulk-shipments/key-and-upload-url',
    );
    return data.data;
  },

  bulkCreate: async (excel_sheet_key: string): Promise<BaseResponse> => {
    const { data } = await apiClient.post<BaseResponse>('/admin/bulk-shipments', { excel_sheet_key });
    return data;
  },
};

export const uploadToS3 = async (url: string, file: File): Promise<void> => {
  await apiClient.put(url, file, {
    headers: {
      'Content-Type': file.type,
    },
    baseURL: '',
  });
};