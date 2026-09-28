import * as XLSX from 'xlsx';

/**
 * Maps each DB/shipment column name to its expected Excel header.
 * Mirrors SHIPMENT_COLUMN_TO_EXCEL_COLUMN_MAP in the backend
 * (src/services/shipment.service.ts).
 */
export const SHIPMENT_COLUMN_TO_EXCEL_COLUMN_MAP = {
  consignor_name: 'Consignor Name',
  consignor_phone: 'Consignor Phone',
  consignor_email: 'Consignor Email',
  consignor_address: 'Consignor Address',
  consignor_pincode: 'Consignor Pincode',
  consignor_city: 'Consignor City',
  consignor_state: 'Consignor State',
  consignor_country: 'Consignor Country',
  return_address: 'Return Address',
  return_pincode: 'Return Pincode',
  return_city: 'Return City',
  return_state: 'Return State',
  return_country: 'Return Country',
  consignee_name: 'Consignee Name',
  consignee_phone: 'Consignee Phone',
  consignee_email: 'Consignee Email',
  consignee_address: 'Consignee Address',
  consignee_pincode: 'Consignee Pincode',
  consignee_city: 'Consignee City',
  consignee_state: 'Consignee State',
  consignee_country: 'Consignee Country',
  return_same_as_pickup: 'Return Same as Pickup',
  payment_mode: 'Payment Mode',
  shipping_mode: 'Shipping Mode',
  cod_amount: 'COD Amount',
  box_length: 'Box Length',
  box_breadth: 'Box Breadth',
  box_height: 'Box Height',
  box_weight: 'Box Weight',
  box_weight_unit: 'Box Weight Unit',
  item_description: 'Item Description',
  shipment_value: 'Shipment Value',
  ewaybill: 'Ewaybill',
} as const;

export type ShipmentExcelColumn = keyof typeof SHIPMENT_COLUMN_TO_EXCEL_COLUMN_MAP;

const EXCEL_COLUMN_TO_SHIPMENT_COLUMN_MAP: Record<string, ShipmentExcelColumn> =
  Object.fromEntries(
    Object.entries(SHIPMENT_COLUMN_TO_EXCEL_COLUMN_MAP).map(
      ([shipmentCol, excelCol]) => [excelCol, shipmentCol as ShipmentExcelColumn],
    ),
  );

/**
 * Parses an .xlsx file and remaps its Excel headers to shipment column names,
 * producing one object per row. Mirrors backend `convertExcelColumnsToShipmentFormat`.
 */
export async function parseAndRemapExcelFile(
  file: File,
): Promise<Record<string, unknown>[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error('The Excel file has no sheets.');
  }
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    throw new Error('The first sheet in the Excel file is empty.');
  }
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    raw: true,
  });

  return rows.map((row) => {
    const remapped: Record<string, unknown> = {};
    for (const [excelCol, value] of Object.entries(row)) {
      const shipmentCol = EXCEL_COLUMN_TO_SHIPMENT_COLUMN_MAP[excelCol];
      if (shipmentCol) {
        remapped[shipmentCol] = value;
      }
    }
    return remapped;
  });
}