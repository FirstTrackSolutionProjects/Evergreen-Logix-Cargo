import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { shipmentsApi } from '@/api/shipments.api';
import { createShipmentSchema } from '@/validations/shipment.validations';
import type { CreateShipmentFormValues } from '@/validations/shipment.validations';
import { COUNTRY, PAYMENT_MODE, SHIPPING_MODE, BOX_WEIGHT_UNIT } from '@/constants/enums';
import { ROUTES } from '@/constants/routes';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import {
  ConsignorSection,
  ConsigneeSection,
  ReturnAddressSection,
  BillingSection,
  PackageSection,
} from './components/ShipmentFormSections';
import styles from './ShipmentFormPage.module.css';

const DEFAULT_VALUES: CreateShipmentFormValues = {
  consignor_name: '',
  consignor_phone: '',
  consignor_email: '',
  consignor_address: '',
  consignor_pincode: '',
  consignor_city: '',
  consignor_state: '',
  consignor_country: COUNTRY.INDIA,
  return_address: '',
  return_pincode: '',
  return_city: '',
  return_state: '',
  return_country: COUNTRY.INDIA,
  consignee_name: '',
  consignee_phone: '',
  consignee_email: '',
  consignee_address: '',
  consignee_pincode: '',
  consignee_city: '',
  consignee_state: '',
  consignee_country: COUNTRY.INDIA,
  return_same_as_pickup: true,
  billing_same_as_pickup: true,
  billing_address: '',
  billing_pincode: '',
  billing_city: '',
  billing_state: '',
  billing_country: COUNTRY.INDIA,
  payment_mode: PAYMENT_MODE.PREPAID,
  shipping_mode: SHIPPING_MODE.SURFACE,
  cod_amount: 0,
  box_length: 0,
  box_breadth: 0,
  box_height: 0,
  box_weight: 0,
  box_weight_unit: BOX_WEIGHT_UNIT.KILOGRAM,
  item_description: '',
  shipment_value: 0,
  ewaybill: '',
};

export function CreateShipmentPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateShipmentFormValues>({
    resolver: zodResolver(createShipmentSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onBlur',
  });

  const returnSame = watch('return_same_as_pickup');
  const billingSame = watch('billing_same_as_pickup');
  const paymentMode = watch('payment_mode');

  const mutation = useMutation({
    mutationFn: (values: CreateShipmentFormValues) => shipmentsApi.create(values),
    onSuccess: () => {
      toast.success('Shipment created successfully');
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      navigate(ROUTES.SHIPMENTS);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create shipment');
    },
  });

  const onSubmit = async (values: CreateShipmentFormValues) => {
    setIsSubmitting(true);
    try {
      await mutation.mutateAsync(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.page} onSubmit={handleSubmit(onSubmit)} noValidate>
      <PageHeader
        title="Create Shipment"
        subtitle="Fill in the shipment details to manifest a new order."
        actions={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(ROUTES.SHIPMENTS)}
              leftIcon={<ArrowLeft size={16} />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              leftIcon={<Save size={16} />}
            >
              Create Shipment
            </Button>
          </>
        }
      />

      <div className={styles.form}>
        <ConsignorSection register={register} errors={errors} />
        <ConsigneeSection register={register} errors={errors} />
        <ReturnAddressSection register={register} errors={errors} sameAsPickup={returnSame} />
        <BillingSection register={register} errors={errors} sameAsPickup={billingSame} />
        <PackageSection register={register} errors={errors} paymentMode={paymentMode} />
      </div>

      <div className={styles.stickyFooter}>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(ROUTES.SHIPMENTS)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          leftIcon={<Save size={16} />}
        >
          Create Shipment
        </Button>
      </div>
    </form>
  );
}