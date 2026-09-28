import type { PaymentMode, ShippingMode, BoxWeightUnit, ShipmentStatus, NdrAction } from '@/constants/enums';

export interface Shipment {
  id: number;
  generated_id: string;
  admin_id: number;
  consignor_name: string;
  consignor_phone: string;
  consignor_email: string;
  consignor_address: string;
  consignor_pincode: string;
  consignor_city: string;
  consignor_state: string;
  consignor_country: string;
  return_address: string;
  return_pincode: string;
  return_city: string;
  return_state: string;
  return_country: string;
  consignee_name: string;
  consignee_phone: string;
  consignee_email: string;
  consignee_address: string;
  consignee_pincode: string;
  consignee_city: string;
  consignee_state: string;
  consignee_country: string;
  return_same_as_pickup: boolean;
  payment_mode: PaymentMode;
  shipping_mode: ShippingMode;
  cod_amount: number;
  box_length: number;
  box_breadth: number;
  box_height: number;
  box_weight: number;
  box_weight_unit: BoxWeightUnit;
  item_description: string;
  shipment_value: number;
  ewaybill: string;
  status: ShipmentStatus;
  created_at: string;
  updated_at: string;
}

export interface ShipmentWithDeliveryPartner extends Shipment {
  dp_first_name: string | null;
  dp_middle_name: string | null;
  dp_last_name: string | null;
  dp_email: string | null;
  dp_phone: string | null;
}

export interface ShipmentTrackingEvent {
  status: ShipmentStatus;
  description: string;
  location: string;
  timestamp: string;
}

export interface ShipmentTrackingResponse {
  status: ShipmentStatus;
  events: ShipmentTrackingEvent[];
}

export interface CreateShipmentPayload {
  consignor_name: string;
  consignor_phone: string;
  consignor_email: string;
  consignor_address: string;
  consignor_pincode: string;
  consignor_city: string;
  consignor_state: string;
  consignor_country: string;
  return_address?: string;
  return_pincode?: string;
  return_city?: string;
  return_state?: string;
  return_country?: string;
  consignee_name: string;
  consignee_phone: string;
  consignee_email: string;
  consignee_address: string;
  consignee_pincode: string;
  consignee_city: string;
  consignee_state: string;
  consignee_country: string;
  return_same_as_pickup: boolean;
  billing_same_as_pickup: boolean;
  billing_address?: string;
  billing_pincode?: string;
  billing_city?: string;
  billing_state?: string;
  billing_country?: string;
  payment_mode: PaymentMode;
  shipping_mode: ShippingMode;
  cod_amount: number;
  box_length: number;
  box_breadth: number;
  box_height: number;
  box_weight: number;
  box_weight_unit: BoxWeightUnit;
  item_description: string;
  shipment_value: number;
  ewaybill?: string;
}

export interface ShipmentListFilters {
  identifier?: string;
  page?: number;
  limit?: number;
  status?: ShipmentStatus;
  delivery_partner_identifier?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}

export interface TakeNdrActionPayload {
  action: NdrAction;
  address: {
    consignee_address: string;
    consignee_city: string;
    consignee_state: string;
    consignee_pincode: string;
  };
}

export interface BulkShipmentUploadUrl {
  key: string;
  url: string;
}