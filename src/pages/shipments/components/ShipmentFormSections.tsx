import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader } from '@/components/ui/Card';
import { COUNTRY, PAYMENT_MODE, SHIPPING_MODE, BOX_WEIGHT_UNIT } from '@/constants/enums';
import type { CreateShipmentFormValues } from '@/validations/shipment.validations';
import styles from './ShipmentFormSections.module.css';

interface SectionProps {
  register: UseFormRegister<CreateShipmentFormValues>;
  errors: FieldErrors<CreateShipmentFormValues>;
}

export function ConsignorSection({ register, errors }: SectionProps) {
  return (
    <Card>
      <CardHeader title="Consignor Details" subtitle="Sender / Pickup information" />
      <div className={styles.grid}>
        <Input
          label="Full Name"
          placeholder="Enter consignor name"
          error={errors.consignor_name?.message}
          requiredMark
          {...register('consignor_name')}
        />
        <Input
          label="Phone"
          placeholder="10-digit mobile number"
          maxLength={10}
          error={errors.consignor_phone?.message}
          requiredMark
          {...register('consignor_phone')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="consignor@example.com"
          error={errors.consignor_email?.message}
          requiredMark
          {...register('consignor_email')}
        />
        <Input
          label="Pincode"
          placeholder="6-digit pincode"
          maxLength={6}
          error={errors.consignor_pincode?.message}
          requiredMark
          {...register('consignor_pincode')}
        />
        <Input
          label="City"
          placeholder="City"
          error={errors.consignor_city?.message}
          requiredMark
          {...register('consignor_city')}
        />
        <Input
          label="State"
          placeholder="State"
          error={errors.consignor_state?.message}
          requiredMark
          {...register('consignor_state')}
        />
        <Select
          label="Country"
          options={[{ label: COUNTRY.INDIA, value: COUNTRY.INDIA }]}
          error={errors.consignor_country?.message}
          requiredMark
          {...register('consignor_country')}
        />
        <div className={styles.fullRow}>
          <Textarea
            label="Full Address"
            placeholder="Street, area, landmark (min 10 characters)"
            error={errors.consignor_address?.message}
            requiredMark
            {...register('consignor_address')}
          />
        </div>
      </div>
    </Card>
  );
}

export function ConsigneeSection({ register, errors }: SectionProps) {
  return (
    <Card>
      <CardHeader title="Consignee Details" subtitle="Receiver / Delivery information" />
      <div className={styles.grid}>
        <Input
          label="Full Name"
          placeholder="Enter consignee name"
          error={errors.consignee_name?.message}
          requiredMark
          {...register('consignee_name')}
        />
        <Input
          label="Phone"
          placeholder="10-digit mobile number"
          maxLength={10}
          error={errors.consignee_phone?.message}
          requiredMark
          {...register('consignee_phone')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="consignee@example.com"
          error={errors.consignee_email?.message}
          requiredMark
          {...register('consignee_email')}
        />
        <Input
          label="Pincode"
          placeholder="6-digit pincode"
          maxLength={6}
          error={errors.consignee_pincode?.message}
          requiredMark
          {...register('consignee_pincode')}
        />
        <Input
          label="City"
          placeholder="City"
          error={errors.consignee_city?.message}
          requiredMark
          {...register('consignee_city')}
        />
        <Input
          label="State"
          placeholder="State"
          error={errors.consignee_state?.message}
          requiredMark
          {...register('consignee_state')}
        />
        <Select
          label="Country"
          options={[{ label: COUNTRY.INDIA, value: COUNTRY.INDIA }]}
          error={errors.consignee_country?.message}
          requiredMark
          {...register('consignee_country')}
        />
        <div className={styles.fullRow}>
          <Textarea
            label="Full Address"
            placeholder="Street, area, landmark (min 10 characters)"
            error={errors.consignee_address?.message}
            requiredMark
            {...register('consignee_address')}
          />
        </div>
      </div>
    </Card>
  );
}

interface ReturnSectionProps extends SectionProps {
  sameAsPickup: boolean;
}

export function ReturnAddressSection({ register, errors, sameAsPickup }: ReturnSectionProps) {
  return (
    <Card>
      <CardHeader title="Return Address" subtitle="Where the shipment returns if undeliverable" />
      <label className={styles.checkboxRow}>
        <input type="checkbox" {...register('return_same_as_pickup')} className={styles.nativeCheckbox} />
        <span>Same as consignor (pickup) address</span>
      </label>

      {!sameAsPickup && (
        <div className={styles.grid}>
          <div className={styles.fullRow}>
            <Textarea
              label="Return Address"
              placeholder="Street, area, landmark"
              error={errors.return_address?.message}
              requiredMark
              {...register('return_address')}
            />
          </div>
          <Input
            label="Pincode"
            placeholder="6-digit pincode"
            maxLength={6}
            error={errors.return_pincode?.message}
            requiredMark
            {...register('return_pincode')}
          />
          <Input
            label="City"
            placeholder="City"
            error={errors.return_city?.message}
            requiredMark
            {...register('return_city')}
          />
          <Input
            label="State"
            placeholder="State"
            error={errors.return_state?.message}
            requiredMark
            {...register('return_state')}
          />
          <Select
            label="Country"
            options={[{ label: COUNTRY.INDIA, value: COUNTRY.INDIA }]}
            error={errors.return_country?.message}
            requiredMark
            {...register('return_country')}
          />
        </div>
      )}
    </Card>
  );
}

export function BillingSection({ register, errors, sameAsPickup }: ReturnSectionProps) {
  return (
    <Card>
      <CardHeader title="Billing Address" subtitle="Optional — defaults to consignor address" />
      <label className={styles.checkboxRow}>
        <input type="checkbox" {...register('billing_same_as_pickup')} className={styles.nativeCheckbox} />
        <span>Same as consignor (pickup) address</span>
      </label>

      {!sameAsPickup && (
        <div className={styles.grid}>
          <div className={styles.fullRow}>
            <Textarea
              label="Billing Address"
              placeholder="Street, area, landmark"
              error={errors.billing_address?.message}
              {...register('billing_address')}
            />
          </div>
          <Input label="Pincode" placeholder="6-digit pincode" maxLength={6} error={errors.billing_pincode?.message} {...register('billing_pincode')} />
          <Input label="City" placeholder="City" error={errors.billing_city?.message} {...register('billing_city')} />
          <Input label="State" placeholder="State" error={errors.billing_state?.message} {...register('billing_state')} />
          <Select
            label="Country"
            options={[{ label: COUNTRY.INDIA, value: COUNTRY.INDIA }]}
            error={errors.billing_country?.message}
            {...register('billing_country')}
          />
        </div>
      )}
    </Card>
  );
}

interface PackageSectionProps extends SectionProps {
  paymentMode: string;
}

export function PackageSection({ register, errors, paymentMode }: PackageSectionProps) {
  return (
    <Card>
      <CardHeader title="Package Details" subtitle="Box dimensions, weight & item info" />
      <div className={styles.grid}>
        <Input
          label="Box Length (cm)"
          type="number"
          min={1}
          placeholder="e.g. 30"
          error={errors.box_length?.message}
          requiredMark
          {...register('box_length')}
        />
        <Input
          label="Box Breadth (cm)"
          type="number"
          min={1}
          placeholder="e.g. 20"
          error={errors.box_breadth?.message}
          requiredMark
          {...register('box_breadth')}
        />
        <Input
          label="Box Height (cm)"
          type="number"
          min={1}
          placeholder="e.g. 15"
          error={errors.box_height?.message}
          requiredMark
          {...register('box_height')}
        />
        <Input
          label="Box Weight"
          type="number"
          step="0.001"
          min={0}
          placeholder="e.g. 1.5"
          error={errors.box_weight?.message}
          requiredMark
          {...register('box_weight')}
        />
        <Select
          label="Weight Unit"
          options={[
            { label: 'Kilograms (kg)', value: BOX_WEIGHT_UNIT.KILOGRAM },
            { label: 'Grams (g)', value: BOX_WEIGHT_UNIT.GRAM },
          ]}
          error={errors.box_weight_unit?.message}
          requiredMark
          {...register('box_weight_unit')}
        />
        <Input
          label="Item Description"
          placeholder="e.g. Electronics, Documents"
          error={errors.item_description?.message}
          requiredMark
          {...register('item_description')}
        />
        <Input
          label="Shipment Value (₹)"
          type="number"
          step="0.01"
          min={0}
          placeholder="e.g. 1000.00"
          error={errors.shipment_value?.message}
          requiredMark
          {...register('shipment_value')}
        />
        <Input
          label="E-waybill (12 digits)"
          placeholder="Required if value ≥ ₹50,000"
          maxLength={12}
          error={errors.ewaybill?.message}
          {...register('ewaybill')}
        />
      </div>

      <div className={styles.divider} />

      <div className={styles.grid}>
        <Select
          label="Payment Mode"
          options={[
            { label: 'Prepaid', value: PAYMENT_MODE.PREPAID },
            { label: 'Cash on Delivery (COD)', value: PAYMENT_MODE.COD },
          ]}
          error={errors.payment_mode?.message}
          requiredMark
          {...register('payment_mode')}
        />
        <Select
          label="Shipping Mode"
          options={[{ label: 'Surface', value: SHIPPING_MODE.SURFACE }]}
          error={errors.shipping_mode?.message}
          requiredMark
          {...register('shipping_mode')}
        />
        {paymentMode === PAYMENT_MODE.COD && (
          <Input
            label="COD Amount (₹)"
            type="number"
            step="0.01"
            min={0}
            placeholder="Amount to collect"
            error={errors.cod_amount?.message}
            requiredMark
            {...register('cod_amount')}
          />
        )}
      </div>
    </Card>
  );
}