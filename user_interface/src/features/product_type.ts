export  type VariantDict = {
    [key: string]: string;
};

export type SkuType = {
    id: number;
    product: number;
    sku_code: string;
    price: string;
    stock_quantity: number | null;
    variants_dict: VariantDict;
    variants: number[];
};

export type ProductType = {
    id: number;
    name: string;
    base_price: string;
    stock_quantity: number | null;
    has_variants: boolean;
    images: ProductImageType[];
    category: number;
    skus: SkuType[];
    key_features: {
        [key: string]: string;
    };
    description: {
        [key: string]: string;
    };
};


export type  ProductImageType = {
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