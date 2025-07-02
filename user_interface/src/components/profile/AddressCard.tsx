import { Pencil, Trash2 } from 'lucide-react';
import { AddressType } from '../../types';
import Button from '../ui/Button';

interface AddressCardProps {
  address: AddressType;
  onEdit: (address: AddressType) => void;
  onDelete: (id: number) => void;
}

const AddressCard = ({ address, onEdit, onDelete }: AddressCardProps) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-medium">{address.name}</h3>
            {address.is_default && (
              <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                Default
              </span>
            )}
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Address:</span> {address.address_line1}
              {address.address_line2 && <>, {address.address_line2}</>}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Area:</span> {address.area}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">City:</span> {address.city}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Phone:</span> {address.phone_number}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(address)}
            aria-label="Edit address"
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(address.id)}
            aria-label="Delete address"
            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;