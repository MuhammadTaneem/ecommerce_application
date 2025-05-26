export interface Category {
  id: number;
  label: string;
  slug: string;
  parent: number | null;
  description: string;
  image: string | null;
  subcategories: Category[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category: string;
  categoryId: number;
  inStock: boolean;
  featured: boolean;
  rating: number;
}

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
}