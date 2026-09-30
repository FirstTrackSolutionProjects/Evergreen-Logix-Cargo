import axios from 'axios';
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
    const { data } = await apiClient.post<BaseResponse>('/admin/bulk-shipments', {
      excel_sheet_key,
    });
    return data;
  },
};

/**
 * Uploads a file directly to S3 using a presigned PUT URL.
 *
 * IMPORTANT: We use a bare axios instance (not `apiClient`) here because:
 *  - The presigned URL already contains AWS auth in the query string.
 *  - Attaching our app's `Authorization: Bearer ...` header would cause S3
 *    to reject the request (signature mismatch).
 *  - We must not send the `/api` baseURL since the URL is absolute.
 */
export const uploadToS3 = async (presignedUrl: string, file: File): Promise<void> => {
  await axios.put(presignedUrl, file, {
    headers: { 'Content-Type': file.type },
    // Do NOT set Authorization or any other app headers here.
  });
};