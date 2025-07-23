import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import { toast } from '../../../hooks/use-toast';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { VariantType } from '../../../types';
import variantService from '../../../services/variantService';
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

interface ValueType {
  id?: number;
  value: string;
}

interface FormDataType {
  name: string;
  values: ValueType[];
}

export default function VariantsPage() {
  const [variants, setVariants] = useState<VariantType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<VariantType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    values: [{ value: '' }]
  });

  // Fetch variants on component mount
  useEffect(() => {
    fetchVariants();
  }, []);

  const fetchVariants = async () => {
    try {
      setIsLoading(true);
      const data = await variantService.getAllVariants();
      setVariants(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch variants');
      toast({
        title: "Error",
        description: "Failed to fetch variants",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Filter out empty values
      const cleanedValues = formData.values.filter(value => value.value.trim() !== '');
      
      if (selectedVariant) {
        // For update, include IDs for existing values
        await variantService.updateVariant(selectedVariant.id, {
          name: formData.name,
          values: cleanedValues.map(value => ({
            id: value.id,
            value: value.value
          }))
        });
        toast({
          title: "Success",
          description: "Variant updated successfully",
        });
      } else {
        // For create, only send value objects without IDs
        await variantService.createVariant({
          name: formData.name,
          values: cleanedValues.map(value => ({
            value: value.value
          }))
        });
        toast({
          title: "Success",
          description: "Variant created successfully",
        });
      }
      
      setIsModalOpen(false);
      setSelectedVariant(null);
      setFormData({ name: '', values: [{ value: '' }] });
      fetchVariants();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save variant",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    setVariantToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!variantToDelete) return;
    
    try {
      await variantService.deleteVariant(variantToDelete);
      toast({
        title: "Success",
        description: "Variant deleted successfully",
      });
      fetchVariants();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete variant",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setVariantToDelete(null);
    }
  };

  const openModal = (variant?: VariantType) => {
    if (variant) {
      setSelectedVariant(variant);
      setFormData({
        name: variant.name,
        values: Array.isArray(variant.values) 
          ? variant.values.map(v => ({
              id: v.id,
              value: v.value
            }))
          : [{ value: '' }]
      });
    } else {
      setSelectedVariant(null);
      setFormData({ name: '', values: [{ value: '' }] });
    }
    setIsModalOpen(true);
  };

  const addValueField = () => {
    setFormData((prev: FormDataType) => ({
      ...prev,
      values: [...prev.values, { value: '' }]
    }));
  };

  const removeValueField = (index: number) => {
    setFormData((prev: FormDataType) => ({
      ...prev,
      values: prev.values.filter((_, i: number) => i !== index)
    }));
  };

  const updateValue = (index: number, value: string) => {
    setFormData((prev: FormDataType) => ({
      ...prev,
      values: prev.values.map((v: ValueType, i: number) => i === index ? { ...v, value } : v)
    }));
  };

  if (isLoading) return <div className="p-4 text-gray-700 dark:text-gray-200">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Variants</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your product variants and their values
          </p>
        </div>
        <Button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2"
          variant="primary"
        >
          <Plus size={16} />
          Add Variant
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Values
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {Array.isArray(variants) && variants.length > 0 ? (
              variants.map((variant) => (
                <tr key={variant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">
                    {variant.name}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(variant.values) && variant.values.map((value) => (
                        <span
                          key={value.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                        >
                          {value.value}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => openModal(variant)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Edit variant"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(variant.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete variant"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No variants found
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
                {selectedVariant ? 'Edit Variant' : 'Add New Variant'}
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
                    Name
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter variant name"
                    className="w-full"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Values
                  </label>
                  {formData.values.map((valueObj, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="text"
                        value={valueObj.value}
                        onChange={(e) => updateValue(index, e.target.value)}
                        placeholder="Enter value"
                        className="flex-1"
                        required
                      />
                      {formData.values.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeValueField(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addValueField}
                    className="w-full mt-2"
                  >
                    Add Value
                  </Button>
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
                  {selectedVariant ? 'Update Variant' : 'Create Variant'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Variant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this variant? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false);
                setVariantToDelete(null);
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