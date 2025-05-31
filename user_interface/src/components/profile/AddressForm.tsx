import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Address } from '../../types';

const addressSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address_line1: z.string().min(1, 'Address line 1 is required'),
  address_line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  area: z.string().min(1, 'Area is required'),
  phone_number: z.string().min(1, 'Phone number is required'),
  is_default: z.boolean().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  address?: Address;
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel: () => void;
}

const AddressForm = ({ address, onSubmit, onCancel }: AddressFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: address || {
      name: '',
      address_line1: '',
      address_line2: '',
      city: '',
      area: '',
      phone_number: '',
      is_default: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Address Name"
        placeholder="Home"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Address Line 1"
        placeholder="123 Main Street"
        error={errors.address_line1?.message}
        {...register('address_line1')}
      />

      <Input
        label="Address Line 2 (Optional)"
        placeholder="Apt 4B"
        error={errors.address_line2?.message}
        {...register('address_line2')}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="City"
          placeholder="Dhaka"
          error={errors.city?.message}
          {...register('city')}
        />

        <Input
          label="Area"
          placeholder="Uttara"
          error={errors.area?.message}
          {...register('area')}
        />
      </div>

      <Input
        label="Phone Number"
        placeholder="+8801234567890"
        error={errors.phone_number?.message}
        {...register('phone_number')}
      />

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_default"
          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          {...register('is_default')}
        />
        <label htmlFor="is_default" className="text-sm text-gray-700 dark:text-gray-300">
          Set as default address
        </label>
      </div>

      <div className="flex space-x-2">
        <Button type="submit" loading={isSubmitting}>
          {address ? 'Update Address' : 'Add Address'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;