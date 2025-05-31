export interface Category {
  id: number;
  label: string;
  slug: string;
  parent: number | null;
  description: string;
  image: string | null;
  subcategories: Category[];
}

export interface CreateCategoryData {
  label: string;
  description?: string;
  parent?: number;
  image?: string;
} 