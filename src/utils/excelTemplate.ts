import * as XLSX from 'xlsx';

/**
 * Excel column headers for the bulk shipment template.
 * These MUST match the `SHIPMENT_COLUMN_TO_EXCEL_COLUMN_MAP` keys
 * defined in the backend `shipment.service.ts` — the bulk upload
 * parser remaps these exact header names to shipment DB columns.
 */
export const BULK_SHIPMENT_EXCEL_COLUMNS = [
  'Consignor Name',
  'Consignor Phone',
  'Consignor Email',
  'Consignor Address',
  'Consignor Pincode',
  'Consignor City',
  'Consignor State',
  'Consignor Country',
  'Return Address',
  'Return Pincode',
  'Return City',
  'Return State',
  'Return Country',
  'Consignee Name',
  'Consignee Phone',
  'Consignee Email',
  'Consignee Address',
  'Consignee Pincode',
  'Consignee City',
  'Consignee State',
  'Consignee Country',
  'Return Same as Pickup',
  'Payment Mode',
  'Shipping Mode',
  'COD Amount',
  'Box Length',
  'Box Breadth',
  'Box Height',
  'Box Weight',
  'Box Weight Unit',
  'Item Description',
  'Shipment Value',
  'Ewaybill',
] as const;

export type BulkShipmentExcelColumn = (typeof BULK_SHIPMENT_EXCEL_COLUMNS)[number];

/**
 * A single example row that mirrors a valid shipment payload so users
 * can see the expected format for every column.
 */
const SAMPLE_ROW: Record<BulkShipmentExcelColumn, string | number | boolean> = {
  'Consignor Name': 'John Doe',
  'Consignor Phone': '9876543210',
  'Consignor Email': 'john.doe@example.com',
  'Consignor Address': '123 Main Street, Andheri West',
  'Consignor Pincode': '400058',
  'Consignor City': 'Mumbai',
  'Consignor State': 'Maharashtra',
  'Consignor Country': 'India',
  'Return Address': '123 Main Street, Andheri West',
  'Return Pincode': '400058',
  'Return City': 'Mumbai',
  'Return State': 'Maharashtra',
  'Return Country': 'India',
  'Consignee Name': 'Jane Smith',
  'Consignee Phone': '9123456780',
  'Consignee Email': 'jane.smith@example.com',
  'Consignee Address': '456 Park Avenue, Koramangala',
  'Consignee Pincode': '560034',
  'Consignee City': 'Bengaluru',
  'Consignee State': 'Karnataka',
  'Consignee Country': 'India',
  'Return Same as Pickup': 'TRUE',
  'Payment Mode': 'PREPAID',
  'Shipping Mode': 'SURFACE',
  'COD Amount': 0,
  'Box Length': 30,
  'Box Breadth': 20,
  'Box Height': 15,
  'Box Weight': 1.5,
  'Box Weight Unit': 'kg',
  'Item Description': 'Electronics',
  'Shipment Value': 1000,
  'Ewaybill': '',
};

/**
 * Generates and triggers download of the bulk shipment Excel template.
 * The first row contains the exact column headers the backend expects,
 * and the second row contains a sample entry that passes validation.
 */
export function downloadBulkShipmentTemplate(): void {
  const worksheet = XLSX.utils.json_to_sheet([SAMPLE_ROW], {
    header: [...BULK_SHIPMENT_EXCEL_COLUMNS],
  });

  // Widen columns so headers are readable when the file opens.
  worksheet['!cols'] = BULK_SHIPMENT_EXCEL_COLUMNS.map((col) => ({
    wch: Math.max(col.length + 2, 14),
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Shipments');

  XLSX.writeFile(workbook, 'bulk-shipment-template.xlsx');
}