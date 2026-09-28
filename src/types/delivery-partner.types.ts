export interface DeliveryPartner {
  id: number;
  generated_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateDeliveryPartnerPayload {
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  email: string;
}

export interface UpdateDeliveryPartnerPayload {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
}

export interface DeliveryPartnerListFilters {
  identifier?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}

export interface AssignShipmentsPayload {
  shipment_ids: number[];
}