import { useState, useEffect } from 'react';
import { Variant, CreateVariantData } from '../../../types/variant';
import { variantApi } from '../../../lib/api/variant';
import { Pencil, Trash2, Eye, Plus } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';

export default function VariantsPage() {
  const { isDark } = useTheme();
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [formData, setFormData] = useState<CreateVariantData>({
    name: '',
    values: [{ value: '' }]
  });

  useEffect(() => {
    fetchVariants();
  }, []);

  const fetchVariants = async () => {
    try {
      setLoading(true);
      const data = await variantApi.getAllVariants();
      setVariants(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch variants');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedVariant) {
        await variantApi.updateVariant(selectedVariant.id!, formData);
      } else {
        await variantApi.createVariant(formData);
      }
      setIsModalOpen(false);
      setSelectedVariant(null);
      setFormData({ name: '', values: [{ value: '' }] });
      fetchVariants();
    } catch (err) {
      setError('Failed to save variant');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this variant?')) {
      try {
        await variantApi.deleteVariant(id);
        fetchVariants();
      } catch (err) {
        setError('Failed to delete variant');
      }
    }
  };

  const openModal = (variant?: Variant) => {
    if (variant) {
      setSelectedVariant(variant);
      setFormData({
        name: variant.name,
        values: variant.values.map(v => ({ value: v.value }))
      });
    } else {
      setSelectedVariant(null);
      setFormData({ name: '', values: [{ value: '' }] });
    }
    setIsModalOpen(true);
  };

  const addValueField = () => {
    setFormData({
      ...formData,
      values: [...formData.values, { value: '' }]
    });
  };

  const removeValueField = (index: number) => {
    setFormData({
      ...formData,
      values: formData.values.filter((_, i) => i !== index)
    });
  };

  const updateValue = (index: number, value: string) => {
    const newValues = [...formData.values];
    newValues[index] = { value };
    setFormData({
      ...formData,
      values: newValues
    });
  };

  if (loading) return <div className="p-4 text-gray-700 dark:text-gray-200">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Variants</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add Variant
        </button>
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
            {variants.map((variant) => (
              <tr key={variant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">
                  {variant.name}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {variant.values.map((v) => (
                      <span
                        key={v.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                      >
                        {v.value}
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
                      onClick={() => handleDelete(variant.id!)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete variant"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-[500px]">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {selectedVariant ? 'Edit Variant' : 'Add Variant'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Values</label>
                <div className="space-y-2">
                  {formData.values.map((value, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={value.value}
                        onChange={(e) => updateValue(index, e.target.value)}
                        className="flex-1 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                      {formData.values.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeValueField(index)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addValueField}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                >
                  <Plus size={16} className="mr-1" />
                  Add Value
                </button>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  {selectedVariant ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 