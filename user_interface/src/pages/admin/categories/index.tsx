import { useState, useEffect } from 'react';
import { Pencil, Trash2, Eye, X, Plus, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../../store/slices/categorySlice';
import { CategoryType } from '../../../types';
import { toast } from '../../../hooks/use-toast';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
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

interface CreateCategoryData {
  label: string;
  description: string;
  parent?: number;
}

const CategoryRow = ({ category, level = 0, onEdit, onDelete, onView }: { 
  category: CategoryType; 
  level?: number;
  onEdit: (category: CategoryType) => void;
  onDelete: (id: number) => void;
  onView: (category: CategoryType) => void;
}) => {
  return (
    <>
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">
          <div style={{ paddingLeft: `${level * 20}px` }} className="flex items-center">
            {level > 0 && <span className="mr-2">└─</span>}
            {category.label}
          </div>
        </td>
        <td className="px-6 py-4 text-gray-900 dark:text-gray-200">
          <span className="truncate max-w-xs">{category.description}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onView(category)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              title="View details"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => onEdit(category)}
              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
              title="Edit category"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete(category.id)}
              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
              title="Delete category"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
      {category.subcategories?.map((subcategory) => (
        <CategoryRow
          key={subcategory.id}
          category={subcategory}
          level={level + 1}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </>
  );
};

// Helper function to flatten categories with level information
const flattenCategoriesWithLevel = (categories: CategoryType[], level = 0): { category: CategoryType; level: number }[] => {
  return categories.reduce<{ category: CategoryType; level: number }[]>((acc, category) => {
    return [
      ...acc,
      { category, level },
      ...flattenCategoriesWithLevel(category.subcategories || [], level + 1)
    ];
  }, []);
};

export default function CategoriesPage() {
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const { categories, isLoading, error } = useSelector((state: RootState) => state.categories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateCategoryData>({
    label: '',
    description: '',
  });

  useEffect(() => {
    dispatch(fetchCategories() as any);
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        await dispatch(updateCategory({
          id: selectedCategory.id,
          data: formData
        }) as any).unwrap();
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        await dispatch(createCategory(formData) as any).unwrap();
        toast({
          title: "Success",
          description: "Category created successfully",
        });
      }
      setIsModalOpen(false);
      setSelectedCategory(null);
      setFormData({ label: '', description: '' });
    } catch (err) {
      console.error('Failed to save category:', err);
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      await dispatch(deleteCategory(categoryToDelete) as any).unwrap();
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (err) {
      console.error('Failed to delete category:', err);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const openModal = (category?: CategoryType) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({
        label: category.label,
        description: category.description,
        parent: category.parent || undefined,
      });
    } else {
      setSelectedCategory(null);
      setFormData({ label: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const openViewModal = (category: CategoryType) => {
    setSelectedCategory(category);
    setIsViewModalOpen(true);
  };

  // Filter top-level categories
  const topLevelCategories = Array.isArray(categories) 
    ? categories.filter(cat => cat.parent === null) 
    : [];

  const foundCategory = categoryToDelete 
    ? (Array.isArray(categories) ? categories.find(c => c.id === categoryToDelete) : null) 
    : null;
  const hasSubcategories = foundCategory && Array.isArray(foundCategory.subcategories) && foundCategory.subcategories.length > 0;

  // Helper function to check if one category is a descendant of another
  const isDescendant = (possibleAncestor: CategoryType, category: CategoryType): boolean => {
    if (!category.subcategories) return false;
    return category.subcategories.some(sub => 
      sub.id === possibleAncestor.id || isDescendant(possibleAncestor, sub)
    );
  };

  if (isLoading) return <div className="p-4 text-gray-700 dark:text-gray-200">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your product categories and subcategories
          </p>
        </div>
        <Button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2"
          variant="primary"
        >
          <Plus size={16} />
          Add Category
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Label
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {topLevelCategories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                onEdit={openModal}
                onDelete={handleDelete}
                onView={openViewModal}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedCategory ? 'Edit Category' : 'Add New Category'}
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
                    Label
                  </label>
                  <Input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="Enter category name"
                    className="w-full px-4 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter category description"
                    className="w-full px-4 py-2 min-h-[100px] resize-y rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Parent Category
                  </label>
                  <Select
                    value={formData.parent || ''}
                    onChange={(e) => setFormData({ ...formData, parent: Number(e.target.value) || undefined })}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    <option value="">None (Top Level)</option>
                    {Array.isArray(categories) && flattenCategoriesWithLevel(categories).map(({ category, level }) => (
                      <option 
                        key={category.id} 
                        value={category.id}
                        disabled={selectedCategory?.id === category.id || 
                                 // Prevent selecting a descendant as parent
                                 (selectedCategory && isDescendant(category, selectedCategory))}
                        className="py-1"
                      >
                        {'\u00A0'.repeat(level * 4)}{level > 0 ? '└─ ' : ''}{category.label}
                      </option>
                    ))}
                  </Select>
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
                  {selectedCategory ? 'Update Category' : 'Create Category'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Category Details
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
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Label</h3>
                <p className="mt-1.5 text-base text-gray-900 dark:text-gray-200">{selectedCategory.label}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
                <p className="mt-1.5 text-base text-gray-900 dark:text-gray-200 whitespace-pre-wrap">
                  {selectedCategory.description || 'No description provided'}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Slug</h3>
                <p className="mt-1.5 text-base text-gray-900 dark:text-gray-200 font-mono">
                  {selectedCategory.slug}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Parent Category</h3>
                <p className="mt-1.5 text-base text-gray-900 dark:text-gray-200">
                  {selectedCategory.parent && Array.isArray(categories)
                    ? categories.find(c => c.id === selectedCategory.parent)?.label 
                    : 'None (Top Level Category)'}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Subcategories</h3>
                <div className="mt-1.5">
                  {selectedCategory.subcategories?.length ? (
                    <ul className="list-disc list-inside space-y-1">
                      {selectedCategory.subcategories.map(sub => (
                        <li key={sub.id} className="text-base text-gray-900 dark:text-gray-200">
                          {sub.label}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-base text-gray-500 dark:text-gray-400 italic">No subcategories</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsViewModalOpen(false);
                  openModal(selectedCategory);
                }}
              >
                Edit Category
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle size={20} />
              Delete Category
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this category? This action cannot be undone.
              {hasSubcategories && (
                <p className="mt-2 text-red-500 font-medium">
                  Warning: This category has subcategories that will also be deleted.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false);
                setCategoryToDelete(null);
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