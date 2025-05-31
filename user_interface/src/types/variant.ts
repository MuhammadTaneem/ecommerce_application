export interface VariantValue {
  id?: number;
  attribute?: number;
  value: string;
}

export interface Variant {
  id?: number;
  name: string;
  slug: string;
  values: VariantValue[];
}

export interface CreateVariantData {
  name: string;
  values: { value: string }[];
} 