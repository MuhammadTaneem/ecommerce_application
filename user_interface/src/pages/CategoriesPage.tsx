import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

// Define the category type
interface Category {
  id: number;
  label: string;
  slug: string;
  parent: number | null;
  description: string;
  image: string | null;
  subcategories: Category[];
}

// Form validation schema
const categorySchema = z.object({
  label: z.string().min(2, 'Label must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  parent: z.number().nullable(),
  image: z.any().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

// Sample data
const sampleCategories: Category[] = [
  {
    id: 1,
    label: "man",
    slug: "man",
    parent: null,
    description: "Category for men",
    image: null,
    subcategories: [
      {
        id: 3,
        label: "shirt",
        slug: "man-shirt",
        parent: 1,
        description: "Men's shirts",
        image: null,
        subcategories: [
          {
            id: 7,
            label: "formal",
            slug: "man-shirt-formal",
            parent: 3,
            description: "Formal shirts for men",
            image: null,
            subcategories: []
          },
          {
            id: 8,
            label: "casual",
            slug: "man-shirt-casual",
            parent: 3,
            description: "Casual shirts for men",
            image: null,
            subcategories: []
          }
        ]
      },
      {
        id: 6,
        label: "pant",
        slug: "man-pant",
        parent: 1,
        description: "Men's pants",
        image: null,
        subcategories: [
          {
            id: 9,
            label: "casual",
            slug: "man-pant-casual",
            parent: 6,
            description: "Casual pants for men",
            image: null,
            subcategories: []
          },
          {
            id: 10,
            label: "formal",
            slug: "man-pant-formal",
            parent: 6,
            description: "Formal pants for men",
            image: null,
            subcategories: []
          }
        ]
      },
      {
        id: 13,
        label: "t-shirt",
        slug: "man-tshirt",
        parent: 1,
        description: "Men's T-shirts",
        image: null,
        subcategories: [
          {
            id: 21,
            label: "graphic",
            slug: "man-tshirt-graphic",
            parent: 13,
            description: "Graphic T-shirts for men",
            image: null,
            subcategories: []
          },
          {
            id: 22,
            label: "plain",
            slug: "man-tshirt-plain",
            parent: 13,
            description: "Plain T-shirts for men",
            image: null,
            subcategories: []
          }
        ]
      },
      {
        id: 15,
        label: "jeans",
        slug: "man-jeans",
        parent: 1,
        description: "Men's jeans",
        image: null,
        subcategories: []
      }
    ]
  },
  {
    id: 2,
    label: "woman",
    slug: "woman",
    parent: null,
    description: "Category for women",
    image: null,
    subcategories: [
      {
        id: 4,
        label: "shirt",
        slug: "woman-shirt",
        parent: 2,
        description: "Women's shirts",
        image: null,
        subcategories: []
      },
      {
        id: 5,
        label: "pant",
        slug: "woman-pant",
        parent: 2,
        description: "Women's pants",
        image: null,
        subcategories: []
      },
      {
        id: 11,
        label: "dress",
        slug: "woman-dress",
        parent: 2,
        description: "Women's dresses",
        image: null,
        subcategories: [
          {
            id: 17,
            label: "formal",
            slug: "woman-dress-formal",
            parent: 11,
            description: "Formal dresses for women",
            image: null,
            subcategories: []
          },
          {
            id: 18,
            label: "casual",
            slug: "woman-dress-casual",
            parent: 11,
            description: "Casual dresses for women",
            image: null,
            subcategories: []
          }
        ]
      },
      {
        id: 12,
        label: "skirt",
        slug: "woman-skirt",
        parent: 2,
        description: "Women's skirts",
        image: null,
        subcategories: [
          {
            id: 19,
            label: "mini",
            slug: "woman-skirt-mini",
            parent: 12,
            description: "Mini skirts for women",
            image: null,
            subcategories: []
          },
          {
            id: 20,
            label: "pencil",
            slug: "woman-skirt-pencil",
            parent: 12,
            description: "Pencil skirts for women",
            image: null,
            subcategories: []
          }
        ]
      },
      {
        id: 14,
        label: "t-shirt",
        slug: "woman-tshirt",
        parent: 2,
        description: "Women's T-shirts",
        image: null,
        subcategories: [
          {
            id: 23,
            label: "graphic",
            slug: "woman-tshirt-graphic",
            parent: 14,
            description: "Graphic T-shirts for women",
            image: null,
            subcategories: []
          },
          {
            id: 24,
            label: "plain",
            slug: "woman-tshirt-plain",
            parent: 14,
            description: "Plain T-shirts for women",
            image: null,
            subcategories: []
          }
        ]
      },
      {
        id: 16,
        label: "jeans",
        slug: "woman-jeans",
        parent: 2,
        description: "Women's jeans",
        image: null,
        subcategories: []
      }
    ]
  }
];

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      // Here you would typically make an API call to save the category
      const response = await fetch('/api/categories', {
        method: editingCategory ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label: data.label,
          description: data.description,
          parent: data.parent,
          image: data.image,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save category');
      }

      // Refresh categories list
      // In a real app, you would fetch the updated list from the API
      setIsModalOpen(false);
      reset();
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      // Handle error (show error message to user)
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId: number) => {
    try {
      // Here you would typically make an API call to delete the category
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      // Refresh categories list
      // In a real app, you would fetch the updated list from the API
    } catch (error) {
      console.error('Error deleting category:', error);
      // Handle error (show error message to user)
    }
  };

  const renderCategoryRow = (category: Category, level: number = 0): React.ReactNode => {
    return (
      <React.Fragment key={category.id}>
        <tr className="border-b dark:border-gray-700">
          <td className="py-4 px-6">
            <div style={{ marginLeft: `${level * 20}px` }}>
              {category.label}
            </div>
          </td>
          <td className="py-4 px-6">{category.slug}</td>
          <td className="py-4 px-6">{category.description}</td>
          <td className="py-4 px-6">
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleEdit(category)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(category.id)}
              >
                Delete
              </Button>
            </div>
          </td>
        </tr>
        {category.subcategories.map((subcategory) =>
          renderCategoryRow(subcategory, level + 1)
        )}
      </React.Fragment>
    );
  };

  // Flatten categories for parent selection
  const flattenedCategories = categories.reduce<Category[]>((acc, category) => {
    const flatten = (cat: Category): Category[] => {
      return [cat, ...cat.subcategories.flatMap(flatten)];
    };
    return [...acc, ...flatten(category)];
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Category</Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Slug
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
            {categories.map((category) => renderCategoryRow(category))}
          </tbody>
        </table>
      </div>

      {/* Modal for adding/editing categories */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Label"
                placeholder="Category label"
                error={errors.label?.message}
                defaultValue={editingCategory?.label}
                {...register('label')}
              />
              <Input
                label="Description"
                placeholder="Category description"
                error={errors.description?.message}
                defaultValue={editingCategory?.description}
                {...register('description')}
              />
              <Select
                label="Parent Category"
                {...register('parent')}
                defaultValue={editingCategory?.parent || ''}
              >
                <option value="">None</option>
                {flattenedCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </Select>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingCategory(null);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCategory ? 'Save Changes' : 'Add Category'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage; 