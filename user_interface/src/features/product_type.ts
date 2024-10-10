type VariantDict = {
    [key: string]: string; // Key-value pairs for variant types like Color, Size, etc.
};

type SKU = {
    id: number;
    product: number;
    sku_code: string;
    price: string; // Assuming price is a string representing a decimal value
    stock_quantity: number | null;
    variants_dict: VariantDict; // A dictionary for variant attributes
    variants: number[]; // Array of variant IDs
};

export type ProductType = {
    id: number;
    name: string;
    description: string;
    base_price: string;
    stock_quantity: number | null;
    has_variants: boolean;
    images: ImageType[]; // Array for image URLs or paths
    category: number;
    skus: SKU[]; // Array of SKUs
};


export type  ImageType = {
    id: number;
    product: number;
    image: string;
    is_main: boolean;
    created_at: string;
    updated_at: string;
}

export type ProductListType = {
    id: number;
    name: string;
    image: string;
    base_price: number;
}