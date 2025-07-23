import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X, Eye } from 'lucide-react';
import { toast } from '../../../hooks/use-toast';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { VoucherType, KeyValuePair } from '../../../types';
import voucherService from '../../../services/voucherService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/AlertDialog';

interface FormDataType {
  code: string;
  discount_type: number;
  discount_value: string;
  valid_from: string;
  valid_to: string;
  usage_limit: number;
  max_discount_amount: string;
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<VoucherType[]>([]);
  const [discountTypes, setDiscountTypes] = useState<KeyValuePair[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    code: '',
    discount_type: 1, // Default to percentage (assuming 1 is percentage)
    discount_value: '',
    valid_from: new Date().toISOString().split('T')[0],
    valid_to: '',
    usage_limit: 0,
    max_discount_amount: ''
  });

  useEffect(() => {
    fetchVouchers();
    fetchDiscountTypes();
  }, []);

  const fetchDiscountTypes = async () => {
    try {
      const response = await fetch('/api/context-data/');
      const data = await response.json();
      if (data.voucher_type) {
        setDiscountTypes(data.voucher_type);
      } else {
        // Fallback to default discount types if context data is not available
        setDiscountTypes([
          { key: 1, value: 'Percentage' },
          { key: 2, value: 'Fixed Amount' }
        ]);
      }
    } catch (err) {
      console.error('Error fetching discount types:', err);
      // Set default discount types on error
      setDiscountTypes([
        { key: 1, value: 'Percentage' },
        { key: 2, value: 'Fixed Amount' }
      ]);
    }
  };

  const getDiscountTypeLabel = (key: number) => {
    if (!Array.isArray(discountTypes)) return '';
    const discountType = discountTypes.find(type => Number(type.key) === key);
    return discountType ? discountType.value : '';
  };

  const fetchVouchers = async () => {
    try {
      setIsLoading(true);
      const data = await voucherService.getAllVouchers();
      setVouchers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch vouchers');
      toast({
        title: "Error",
        description: "Failed to fetch vouchers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        discount_type: Number(formData.discount_type)
      };

      if (selectedVoucher) {
        await voucherService.updateVoucher(selectedVoucher.id, submitData);
        toast({
          title: "Success",
          description: "Voucher updated successfully",
        });
      } else {
        await voucherService.createVoucher(submitData);
        toast({
          title: "Success",
          description: "Voucher created successfully",
        });
      }
      
      setIsModalOpen(false);
      setSelectedVoucher(null);
      setFormData({
        code: '',
        discount_type: 1,
        discount_value: '',
        valid_from: new Date().toISOString().split('T')[0],
        valid_to: '',
        usage_limit: 0,
        max_discount_amount: ''
      });
      fetchVouchers();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save voucher",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    setVoucherToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!voucherToDelete) return;
    
    try {
      await voucherService.deleteVoucher(voucherToDelete);
      toast({
        title: "Success",
        description: "Voucher deleted successfully",
      });
      fetchVouchers();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete voucher",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setVoucherToDelete(null);
    }
  };

  const openModal = (voucher?: VoucherType) => {
    if (voucher) {
      setSelectedVoucher(voucher);
      setFormData({
        code: voucher.code,
        discount_type: voucher.discount_type,
        discount_value: voucher.discount_value,
        valid_from: new Date(voucher.valid_from).toISOString().split('T')[0],
        valid_to: new Date(voucher.valid_to).toISOString().split('T')[0],
        usage_limit: voucher.usage_limit,
        max_discount_amount: voucher.max_discount_amount
      });
    } else {
      setSelectedVoucher(null);
      setFormData({
        code: '',
        discount_type: 1, // Default to percentage
        discount_value: '',
        valid_from: new Date().toISOString().split('T')[0],
        valid_to: '',
        usage_limit: 0,
        max_discount_amount: ''
      });
    }
    setIsModalOpen(true);
  };

  const openViewModal = async (id: number) => {
    try {
      const voucher = await voucherService.getVoucherById(id);
      setSelectedVoucher(voucher);
      setIsViewModalOpen(true);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch voucher details",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div className="p-4 text-gray-700 dark:text-gray-200">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vouchers</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your discount vouchers
          </p>
        </div>
        <Button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2"
          variant="primary"
        >
          <Plus size={16} />
          Add Voucher
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Valid Until
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {Array.isArray(vouchers) && vouchers.length > 0 ? (
              vouchers.map((voucher) => (
                <tr key={voucher.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">
                    {voucher.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">
                    {getDiscountTypeLabel(voucher.discount_type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">
                    {voucher.discount_value}
                    {Number(voucher.discount_type) === 1 ? '%' : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">
                    {new Date(voucher.valid_to).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => openViewModal(voucher.id)}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openModal(voucher)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Edit voucher"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(voucher.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete voucher"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No vouchers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedVoucher ? 'Edit Voucher' : 'Add New Voucher'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Code
                  </label>
                  <Input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Enter voucher code"
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Discount Type
                  </label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    {Array.isArray(discountTypes) && discountTypes.map((type) => (
                      <option key={type.key} value={type.key}>
                        {type.value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Discount Value
                  </label>
                  <Input
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    placeholder="Enter discount value"
                    className="w-full"
                    required
                    min="0"
                    step={formData.discount_type === 1 ? '1' : '0.01'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Valid From
                  </label>
                  <Input
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Valid To
                  </label>
                  <Input
                    type="date"
                    value={formData.valid_to}
                    onChange={(e) => setFormData({ ...formData, valid_to: e.target.value })}
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Usage Limit
                  </label>
                  <Input
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: parseInt(e.target.value) })}
                    placeholder="Enter usage limit"
                    className="w-full"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Maximum Discount Amount
                  </label>
                  <Input
                    type="number"
                    value={formData.max_discount_amount}
                    onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value })}
                    placeholder="Enter maximum discount amount"
                    className="w-full"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  {selectedVoucher ? 'Update Voucher' : 'Create Voucher'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && selectedVoucher && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Voucher Details
              </h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Code</h3>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedVoucher.code}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Discount Type</h3>
                <p className="mt-1 text-gray-900 dark:text-white capitalize">
                  {getDiscountTypeLabel(selectedVoucher.discount_type)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Discount Value</h3>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {selectedVoucher.discount_value}
                  {Number(selectedVoucher.discount_type) === 1 ? '%' : ''}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Valid Period</h3>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {new Date(selectedVoucher.valid_from).toLocaleDateString()} - {new Date(selectedVoucher.valid_to).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Usage Limit</h3>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedVoucher.usage_limit}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Times Used</h3>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedVoucher.times_used || 0}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Maximum Discount Amount</h3>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedVoucher.max_discount_amount}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Voucher</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this voucher? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false);
                setVoucherToDelete(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 