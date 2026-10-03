import type { ShipmentLabelData } from "@/types/shipment.types";

export const generateShipmentLabelPDFBase64 = async (html: string): Promise<string> => {
    if (typeof document === "undefined") {
        throw new Error("PDF generation requires a browser environment.");
    }
    const [{ default: jsPDF }, html2canvasModule, barcodeModule] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
        import("jsbarcode"),
    ]);
    const html2canvas = html2canvasModule.default;
    const JsBarcode = barcodeModule.default;

    const frame = document.createElement("iframe");
    frame.setAttribute("aria-hidden", "true");
    frame.style.position = "absolute";
    frame.style.left = "-9999px";
    frame.style.top = "0";
    frame.style.width = "100mm";
    frame.style.height = "150mm";
    frame.style.border = "0";

    document.body.appendChild(frame);

    try {
        const frameDocument = frame.contentDocument;
        if (!frameDocument) throw new Error("Could not load the shipment label HTML.");
        frameDocument.open();
        frameDocument.write(html);
        frameDocument.close();
        await new Promise<void>((resolve) => window.setTimeout(resolve, 40));
        const logo = frameDocument.querySelector<HTMLImageElement>(".logo");
        if (logo) await logo.decode();

        const printStyles = frameDocument.createElement("style");
        printStyles.textContent = "body { width: 100mm !important; padding: 0 !important; background: #fff !important; } .label { width: 100mm !important; max-width: none !important; min-height: 150mm !important; margin: 0 !important; border-width: 1.5px !important; }";
        frameDocument.head.appendChild(printStyles);

        const label = frameDocument.querySelector<HTMLElement>(".label") ?? frameDocument.body;
        const barcode = frameDocument.querySelector<SVGSVGElement>(".shipment-barcode");
        if (barcode) {
            JsBarcode(barcode, barcode.dataset.value ?? "", {
                format: "CODE128",
                lineColor: "#0f172a",
                width: 2,
                height: 48,
                displayValue: false,
                margin: 0,
            });
        }

        const labelBounds = label.getBoundingClientRect();
        if (labelBounds.width === 0 || labelBounds.height === 0) {
            throw new Error("The shipment label has no renderable size.");
        }
        const canvas = await html2canvas(label, {
            scale: 2,
            backgroundColor: "#ffffff",
            useCORS: true,
            windowWidth: label.scrollWidth,
            windowHeight: label.scrollHeight,
        });
        if (canvas.width === 0 || canvas.height === 0) {
            throw new Error("The shipment label could not be rendered.");
        }

        const image = canvas.toDataURL("image/jpeg", 0.92);
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [100, 150], compress: true });
        pdf.addImage(image, "JPEG", 0, 0, 100, 150, undefined, "FAST");
        const dataUri = pdf.output("datauristring");
        const base64 = dataUri.slice(dataUri.indexOf(",") + 1);
        if (!base64) throw new Error("PDF generation returned empty data.");
        return base64;
    } finally {
        frame.remove();
    }
};

const escapeHtml = (value: unknown): string => String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const displayValue = (value: unknown): string => {
        if (value === undefined || value === null || value === "") return "";
        return escapeHtml(value);
};

const addressLines = (address: string, city: string, state: string, pincode: string, country: string) =>
        [address, [city, state, pincode].filter(Boolean).join(", "), country]
                .map(displayValue)
                .filter(Boolean)
                .map((line) => `<div>${line}</div>`)
                .join("");

const generateShipmentLabel = (payload: ShipmentLabelData): string => {
        const returnAddress = payload.return_same_as_pickup
                ? addressLines(
                        payload.consignor_address,
                        payload.consignor_city,
                        payload.consignor_state,
                        payload.consignor_pincode,
                        payload.consignor_country,
                )
                : addressLines(
                        payload.return_address,
                        payload.return_city,
                        payload.return_state,
                        payload.return_pincode,
                        payload.return_country,
                );
        const ewaybill = displayValue(payload.ewaybill);
        const codAmount = payload.payment_mode === "COD" ? displayValue(payload.cod_amount) : "";
        const dimensions = [payload.box_length, payload.box_breadth, payload.box_height]
                .map(displayValue)
                .filter(Boolean)
                .join(" × ");

        return `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Shipment Label - ${displayValue(payload.generated_id)}</title>
    <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 16px; background: #f1f5f9; color: #1e293b; font: 14px/1.4 Arial, Helvetica, sans-serif; }
        .label { width: 100%; max-width: 420px; margin: 0 auto; padding: 18px; background: #fff; border: 2px solid #059669; }
        .header { display: flex; min-height: 68px; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 12px; border-bottom: 2px solid #10b981; }
        .logo { display: block; width: 72px; height: 72px; flex: 0 0 72px; object-fit: contain; }
        .brand { color: #047857; font-size: 12px; font-weight: 700; text-align: right; }
        .shipment-id { display: grid; grid-template-columns: 1fr 1fr; align-items: stretch; margin: 12px 0; padding: 8px; background: #0f172a; color: #fff; }
        .shipment-id-copy { display: flex; flex-direction: column; justify-content: center; min-width: 0; padding: 6px 10px; border-right: 1px solid #475569; }
        .shipment-id small { display: block; margin-bottom: 4px; color: #a7f3d0; font-size: 10px; font-weight: 700; }
        .shipment-id strong { font-size: 18px; overflow-wrap: anywhere; }
        .shipment-barcode { display: block; width: 100%; max-width: 190px; height: 58px; }
        .shipment-barcode-section { display: flex; align-items: center; justify-content: center; min-width: 0; padding: 4px 8px; background: #fff; }
        .badges { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 12px; }
        .badge { flex: 1; padding: 7px 8px; border: 1px solid #a7f3d0; background: #f0fdf4; color: #047857; font-size: 11px; font-weight: 700; text-align: center; }
        .section { margin-top: 10px; border: 1px solid #cbd5e1; }
        .section-title { padding: 6px 9px; background: #f1f5f9; color: #047857; font-size: 11px; font-weight: 700; text-transform: uppercase; }
        .section-body { padding: 9px; }
        .name { margin-bottom: 4px; font-size: 16px; font-weight: 700; }
        .details { color: #334155; }
        .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }
        .meta-item { padding: 8px; background: #f8fafc; }
        .meta-label { display: block; margin-bottom: 2px; color: #64748b; font-size: 10px; font-weight: 700; text-transform: uppercase; }
        .meta-value { font-weight: 700; overflow-wrap: anywhere; }
        .footer { margin-top: 12px; padding-top: 8px; border-top: 1px solid #cbd5e1; color: #64748b; font-size: 10px; text-align: center; }
        @media print { @page { size: 100mm 150mm; margin: 0; } body { padding: 0; background: #fff; } .label { width: 100mm; max-width: none; min-height: 150mm; margin: 0; border-width: 1.5px; } }
    </style>
</head>
<body>
    <main class="label">
        <header class="header">
            <img class="logo" src="/Logo.png" alt="Evergreen Logix" />
            <div class="brand">EVERGREEN LOGIX<br>CARGO</div>
        </header>
        <div class="shipment-id">
            <div class="shipment-id-copy"><small>SHIPMENT ID</small><strong>${displayValue(payload.generated_id)}</strong></div>
            <div class="shipment-barcode-section"><svg class="shipment-barcode" data-value="${displayValue(payload.generated_id)}" role="img" aria-label="Barcode for shipment ${displayValue(payload.generated_id)}"></svg></div>
        </div>
        <div class="badges"><span class="badge">${displayValue(payload.shipping_mode)}</span><span class="badge">${displayValue(payload.payment_mode)}</span></div>
        <section class="section">
            <div class="section-title">Ship To</div>
            <div class="section-body"><div class="name">${displayValue(payload.consignee_name)}</div><div class="details">${addressLines(payload.consignee_address, payload.consignee_city, payload.consignee_state, payload.consignee_pincode, payload.consignee_country)}</div><div class="details">${displayValue(payload.consignee_phone)}</div></div>
        </section>
        <section class="section">
            <div class="section-title">Return To</div>
            <div class="section-body"><div class="name">${displayValue(payload.consignor_name)}</div><div class="details">${returnAddress}</div><div class="details">${displayValue(payload.consignor_phone)}</div></div>
        </section>
        <section class="section">
            <div class="section-title">Package Details</div>
            <div class="section-body"><div class="details">${displayValue(payload.item_description)}</div><div class="meta">
                <div class="meta-item"><span class="meta-label">Weight</span><span class="meta-value">${displayValue(payload.box_weight)} ${displayValue(payload.box_weight_unit)}</span></div>
                ${dimensions ? `<div class="meta-item"><span class="meta-label">Dimensions (L × B × H)</span><span class="meta-value">${dimensions}</span></div>` : ""}
                <div class="meta-item"><span class="meta-label">Shipment Value</span><span class="meta-value">${displayValue(payload.shipment_value)}</span></div>
                ${codAmount ? `<div class="meta-item"><span class="meta-label">Collect on Delivery</span><span class="meta-value">${codAmount}</span></div>` : ""}
                ${ewaybill ? `<div class="meta-item"><span class="meta-label">E-way Bill</span><span class="meta-value">${ewaybill}</span></div>` : ""}
            </div></div>
        </section>
        <footer class="footer">Handle with care · ${displayValue(payload.generated_id)}</footer>
    </main>
</body>
</html>`;
}

export default generateShipmentLabel;