export type CategoryType = {
    id: number;
    label: string;
    slug: string;
    parent: number | null;
    description: string;
    image: string | null;
    subcategories: CategoryType[];
};

export  type VariantDict = {
    [key: string]:  string | number ;
};

export type VariantValuesType = {
    id: number;
    attribute : number;
    value: string;
}

export type VariantType = {
    id: number;
    name:string;
    slug:string;
    values : VariantValuesType[];
}

export type SkuType = {
    id: number;
    product: number;
    sku_code: string;
    price: number;
    stock_quantity: number | null;
    variants_dict: VariantDict;
    variants: number[];
};


export type BrandType = {
    id: number;
    name: string;
    description: string | null;
    created_at: string; // ISO format date
    updated_at: string; // ISO format date
};

export type TagType = {
    id: number;
    name: string;
    slug: string;
    created_at: string; // ISO format date
    updated_at: string; // ISO format date
};



export type ProductType = {
    id: number;
    name: string;
    base_price: number;
    short_description: string;
    discount_price: number;
    stock_quantity: number | null;
    has_variants: boolean;
    images: ProductImageType[];
    category: number;
    skus: SkuType[];
    brand: BrandType | null;
    tags: TagType[];
    key_features: {
        [key: string]: string;
    };
    description: {
        [key: string]: string;
    };
    additional_info: {
        [key: string]: string;
    };
};


export type  ProductImageType = {
    id: number | null;
    product: number|null;
    image: string|File;
    is_main: boolean;
    created_at: string| null;
    updated_at: string | null;
}

export type ProductListType = {
    id: number;
    name: string;
    image: string;
    base_price: number;
    has_variants: boolean;
}

export interface AdminProductListType extends ProductListType {
    admin_notes: string;
    stock_quantity: number;
    image: string;
}


export type  ProductContextType = {
    brands: BrandType[];
    tags : TagType[];
    categories : CategoryType[];
    variants : VariantType[];

}