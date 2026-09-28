import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { shipmentsApi } from '@/api/shipments.api';
import { updateShipmentSchema } from '@/validations/shipment.validations';
import type { UpdateShipmentFormValues } from '@/validations/shipment.validations';
import { COUNTRY, PAYMENT_MODE, SHIPPING_MODE, BOX_WEIGHT_UNIT } from '@/constants/enums';
import { ROUTES } from '@/constants/routes';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  ConsignorSection,
  ConsigneeSection,
  ReturnAddressSection,
  BillingSection,
  PackageSection,
} from './components/ShipmentFormSections';
import styles from './ShipmentFormPage.module.css';

export function UpdateShipmentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: shipment, isLoading } = useQuery({
    queryKey: ['shipment', id],
    queryFn: () => shipmentsApi.getById(id!),
    enabled: Boolean(id),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UpdateShipmentFormValues>({
    resolver: zodResolver(updateShipmentSchema),
    defaultValues: {
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
    },
  });

  useEffect(() => {
    if (shipment) {
      reset({
        consignor_name: shipment.consignor_name,
        consignor_phone: shipment.consignor_phone,
        consignor_email: shipment.consignor_email,
        consignor_address: shipment.consignor_address,
        consignor_pincode: shipment.consignor_pincode,
        consignor_city: shipment.consignor_city,
        consignor_state: shipment.consignor_state,
        consignor_country: COUNTRY.INDIA,
        return_address: shipment.return_address,
        return_pincode: shipment.return_pincode,
        return_city: shipment.return_city,
        return_state: shipment.return_state,
        return_country: COUNTRY.INDIA,
        consignee_name: shipment.consignee_name,
        consignee_phone: shipment.consignee_phone,
        consignee_email: shipment.consignee_email,
        consignee_address: shipment.consignee_address,
        consignee_pincode: shipment.consignee_pincode,
        consignee_city: shipment.consignee_city,
        consignee_state: shipment.consignee_state,
        consignee_country: COUNTRY.INDIA,
        return_same_as_pickup: shipment.return_same_as_pickup,
        billing_same_as_pickup: true,
        billing_address: '',
        billing_pincode: '',
        billing_city: '',
        billing_state: '',
        billing_country: COUNTRY.INDIA,
        payment_mode: shipment.payment_mode,
        shipping_mode: SHIPPING_MODE.SURFACE,
        cod_amount: Number(shipment.cod_amount),
        box_length: shipment.box_length,
        box_breadth: shipment.box_breadth,
        box_height: shipment.box_height,
        box_weight: Number(shipment.box_weight),
        box_weight_unit: shipment.box_weight_unit,
        item_description: shipment.item_description,
        shipment_value: Number(shipment.shipment_value),
        ewaybill: shipment.ewaybill,
      });
    }
  }, [shipment, reset]);

  const returnSame = watch('return_same_as_pickup');
  const billingSame = watch('billing_same_as_pickup');
  const paymentMode = watch('payment_mode');

  const mutation = useMutation({
    mutationFn: (values: UpdateShipmentFormValues) => shipmentsApi.update(id!, values),
    onSuccess: () => {
      toast.success('Shipment updated successfully');
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      queryClient.invalidateQueries({ queryKey: ['shipment', id] });
      navigate(ROUTES.SHIPMENT_DETAIL(id!));
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update shipment');
    },
  });

  const onSubmit = async (values: UpdateShipmentFormValues) => {
    setIsSubmitting(true);
    try {
      await mutation.mutateAsync(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.center}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!shipment) {
    return (
      <EmptyState
        title="Shipment not found"
        description="This shipment may have been removed."
      />
    );
  }

  return (
    <form className={styles.page} onSubmit={handleSubmit(onSubmit)} noValidate>
      <PageHeader
        title={`Edit Shipment ${shipment.generated_id}`}
        subtitle="Update the shipment details below."
        actions={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(ROUTES.SHIPMENT_DETAIL(id!))}
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
              Save Changes
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
        <Button type="button" variant="secondary" onClick={() => navigate(ROUTES.SHIPMENT_DETAIL(id!))}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting} leftIcon={<Save size={16} />}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}