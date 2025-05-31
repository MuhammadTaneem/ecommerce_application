import { Variant, CreateVariantData } from '../../types/variant';

// Sample data
const sampleVariants: Variant[] = [
  {
    "id": 1,
    "name": "Color",
    "slug": "color",
    "values": [
      { "id": 1, "attribute": 1, "value": "Red" },
      { "id": 2, "attribute": 1, "value": "Blue" },
      { "id": 3, "attribute": 1, "value": "Green" },
      { "id": 4, "attribute": 1, "value": "Yellow" },
      { "id": 5, "attribute": 1, "value": "Black" },
      { "id": 6, "attribute": 1, "value": "White" },
      { "id": 7, "attribute": 1, "value": "Purple" },
      { "id": 8, "attribute": 1, "value": "Orange" }
    ]
  },
  {
    "id": 2,
    "name": "Size",
    "slug": "size",
    "values": [
      { "id": 9, "attribute": 2, "value": "XS" },
      { "id": 10, "attribute": 2, "value": "S" },
      { "id": 11, "attribute": 2, "value": "M" },
      { "id": 12, "attribute": 2, "value": "L" },
      { "id": 13, "attribute": 2, "value": "XL" },
      { "id": 14, "attribute": 2, "value": "XXL" },
      { "id": 15, "attribute": 2, "value": "3XL" }
    ]
  },
  {
    "id": 3,
    "name": "Material",
    "slug": "material",
    "values": [
      { "id": 16, "attribute": 3, "value": "Cotton" },
      { "id": 17, "attribute": 3, "value": "Polyester" },
      { "id": 18, "attribute": 3, "value": "Linen" },
      { "id": 19, "attribute": 3, "value": "Silk" },
      { "id": 20, "attribute": 3, "value": "Wool" },
      { "id": 21, "attribute": 3, "value": "Denim" },
      { "id": 22, "attribute": 3, "value": "Rayon" },
      { "id": 23, "attribute": 3, "value": "Viscose" }
    ]
  },
  {
    "id": 4,
    "name": "Fit",
    "slug": "fit",
    "values": [
      { "id": 24, "attribute": 4, "value": "Regular Fit" },
      { "id": 25, "attribute": 4, "value": "Slim Fit" },
      { "id": 26, "attribute": 4, "value": "Relaxed Fit" },
      { "id": 27, "attribute": 4, "value": "Oversized" },
      { "id": 28, "attribute": 4, "value": "Loose Fit" }
    ]
  },
  {
    "id": 5,
    "name": "Sleeve Length",
    "slug": "sleeve-length",
    "values": [
      { "id": 29, "attribute": 5, "value": "Full Sleeve" },
      { "id": 30, "attribute": 5, "value": "Half Sleeve" },
      { "id": 31, "attribute": 5, "value": "Sleeveless" },
      { "id": 32, "attribute": 5, "value": "Three Quarter Sleeve" }
    ]
  },
  {
    "id": 6,
    "name": "Pattern",
    "slug": "pattern",
    "values": [
      { "id": 33, "attribute": 6, "value": "Solid" },
      { "id": 34, "attribute": 6, "value": "Striped" },
      { "id": 35, "attribute": 6, "value": "Checked" },
      { "id": 36, "attribute": 6, "value": "Printed" },
      { "id": 37, "attribute": 6, "value": "Embroidered" },
      { "id": 38, "attribute": 6, "value": "Floral" }
    ]
  },
  {
    "id": 7,
    "name": "Gender",
    "slug": "gender",
    "values": []
  }
];

export const variantApi = {
  async getAllVariants(): Promise<Variant[]> {
    return sampleVariants;
  },

  async createVariant(data: CreateVariantData): Promise<Variant> {
    const newVariant: Variant = {
      id: Math.max(...sampleVariants.map(v => v.id || 0)) + 1,
      name: data.name,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      values: data.values.map((v, index) => ({
        id: Math.max(...sampleVariants.flatMap(v => v.values).map(v => v.id || 0)) + index + 1,
        attribute: Math.max(...sampleVariants.map(v => v.id || 0)) + 1,
        value: v.value
      }))
    };
    
    sampleVariants.push(newVariant);
    return newVariant;
  },

  async updateVariant(id: number, data: Partial<CreateVariantData>): Promise<Variant> {
    const variant = sampleVariants.find(v => v.id === id);
    if (!variant) {
      throw new Error('Variant not found');
    }

    if (data.name) {
      variant.name = data.name;
      variant.slug = data.name.toLowerCase().replace(/\s+/g, '-');
    }
    if (data.values) {
      variant.values = data.values.map((v, index) => ({
        id: Math.max(...sampleVariants.flatMap(v => v.values).map(v => v.id || 0)) + index + 1,
        attribute: variant.id,
        value: v.value
      }));
    }

    return variant;
  },

  async deleteVariant(id: number): Promise<void> {
    const index = sampleVariants.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error('Variant not found');
    }
    sampleVariants.splice(index, 1);
  },
}; 