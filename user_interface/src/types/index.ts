export interface AddressType {
  id: number;
  name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  area: string;
  phone_number: string;
  is_default: boolean;
}

export interface CategoryType {
  id: number;
  label: string;
  slug: string;
  parent: number | null;
  description: string;
  image: string | null;
  subcategories: CategoryType[];
}


export interface TagType {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface ProductImageType {
  id: number;
  image: string;
}

export interface SKUType {
  id: number;
  product: number;
  sku_code: string;
  price: string;
  discount_price: string;
  stock_quantity: number;
  variants_dict: Record<string, string>;
  variants: number[];
}

export interface Brand {
  id?: number;
  name: string;
  description: string;
}


export interface ProductType {
  id: number;
  name: string;
  base_price: string;
  stock_quantity: number;
  has_variants: boolean;
  short_description: string;
  discount_price: string;
  category: number;
  key_features: string[];
  description: Record<string, string>;
  additional_info: Record<string, string>;
  thumbnail: string;
  brand: string | number | null;
  tags: TagType[];
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_deleted: boolean;
  images: ProductImageType[];
  skus: SKUType[];
  average_rating: number;
  rating_count: number;
  featured: boolean;
}


export interface VoucherType {
  id: number;
  code: string;
  discount_type: number;
  discount_value: string;
  valid_from: string;
  valid_to: string;
  usage_limit: number;
  max_discount_amount: string;
  times_used?: number;
}


export type CartItemType = {
  id: number;
  product: number;
  sku: number;
  quantity: number;
  unit_price: string;
  subtotal: string;
};

export type CartType = {
  id: number;
  user: number;
  items: CartItemType[];
  total_amount: string;
  total_items: number;
  created_at: string;
  updated_at: string;
};

export interface CampaignType {
  id: number;
  name: string;
  description: string;
  image_1: string|File| null; // URL or base64 encoded image
  image_2: string|File| null; 
  image_3: string|File| null; 
  startDate: string;
  endDate: string;
  is_published: boolean;
}

export interface OrderType {
  id?: number;
  order_number: string;
  status: number; // Adjust if there are other statuses
  payment_status: number; // Adjust as needed
  city: string;
  area: string;
  address_line1: string;
  address_line2: string;
  subtotal: string; // If you want to convert to number, use `number` instead
  shipping_cost: string;
  phone_number: string;
  tax: string;
  discount_amount: string;
  total: string;
  voucher: number | null;
  notes: string|null;
  created_at: Date; // ISO date string
  updated_at: string;
};


export interface OrderItemType {
  id?: string|number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  image?: string;
}

export interface BrandType {
  id: number;
  name: string;
  description: string;
}


export interface VariantValueType {
  id: number;
  attribute: number;
  value: string;
}

export interface VariantType {
  id: number;
  name: string;
  slug: string;
  values: VariantValueType[];
}
// KeyValuePair is a reusable interface for all key-value pair items
export interface KeyValuePair {
  key: number;
  value: string;
}

// Interface representing the full response object
export interface ContextDataType {
  categories: CategoryType[];
  variants: VariantType[];
  brands: BrandType[];
  tags: TagType[];
  order_status: KeyValuePair[];
  payment_status: KeyValuePair[];
  voucher_type: KeyValuePair[];
}