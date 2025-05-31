import { Brand, CreateBrandData } from '../../types/brand';

// Sample data
const sampleBrands: Brand[] = [
  {
    "id": 1,
    "name": "Nike",
    "description": "Global sportswear brand known for athletic shoes, apparel, and equipment."
  },
  {
    "id": 2,
    "name": "Adidas",
    "description": "German multinational brand designing sports clothing and accessories."
  },
  {
    "id": 3,
    "name": "Puma",
    "description": "Brand offering casual and athletic footwear, apparel, and accessories."
  },
  {
    "id": 4,
    "name": "Levi's",
    "description": "Renowned for denim jeans and other casual wear products."
  },
  {
    "id": 5,
    "name": "H&M",
    "description": "Swedish fast-fashion brand offering trendy clothing at affordable prices."
  },
  {
    "id": 6,
    "name": "Zara",
    "description": "Spanish brand known for stylish clothing collections for men, women, and kids."
  },
  {
    "id": 7,
    "name": "Uniqlo",
    "description": "Japanese casual wear designer, manufacturer, and retailer."
  },
  {
    "id": 8,
    "name": "Gucci",
    "description": "Luxury Italian fashion brand known for high-end clothing and accessories."
  },
  {
    "id": 9,
    "name": "Louis Vuitton",
    "description": "French luxury fashion house known for bags, shoes, and apparel."
  },
  {
    "id": 10,
    "name": "Under Armour",
    "description": "American brand offering innovative athletic performance gear."
  },
  {
    "id": 11,
    "name": "Reebok",
    "description": "Sportswear brand known for fitness and lifestyle clothing and footwear."
  },
  {
    "id": 12,
    "name": "Fila",
    "description": "Heritage athletic brand offering retro-inspired sports fashion."
  },
  {
    "id": 13,
    "name": "New Balance",
    "description": "American sports footwear and apparel brand."
  },
  {
    "id": 14,
    "name": "Tommy Hilfiger",
    "description": "Classic American cool style with preppy and premium clothing."
  },
  {
    "id": 15,
    "name": "Calvin Klein",
    "description": "American brand known for minimalistic, high-quality fashion."
  },
  {
    "id": 16,
    "name": "Guess",
    "description": "Global lifestyle brand known for denim, accessories, and youthful style."
  },
  {
    "id": 17,
    "name": "Mango",
    "description": "Spanish fashion brand offering modern and urban clothing."
  },
  {
    "id": 18,
    "name": "Diesel",
    "description": "Italian brand known for its denim and contemporary styles."
  },
  {
    "id": 19,
    "name": "ASOS",
    "description": "British online fashion and cosmetic retailer for young adults."
  },
  {
    "id": 20,
    "name": "Balenciaga",
    "description": "Luxury fashion house known for bold and innovative designs."
  }
];

export const brandApi = {
  async getAllBrands(): Promise<Brand[]> {
    return sampleBrands;
  },

  async createBrand(data: CreateBrandData): Promise<Brand> {
    const newBrand: Brand = {
      id: Math.max(...sampleBrands.map(b => b.id || 0)) + 1,
      name: data.name,
      description: data.description
    };
    
    sampleBrands.push(newBrand);
    return newBrand;
  },

  async updateBrand(id: number, data: Partial<CreateBrandData>): Promise<Brand> {
    const brand = sampleBrands.find(b => b.id === id);
    if (!brand) {
      throw new Error('Brand not found');
    }

    if (data.name) brand.name = data.name;
    if (data.description) brand.description = data.description;

    return brand;
  },

  async deleteBrand(id: number): Promise<void> {
    const index = sampleBrands.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error('Brand not found');
    }
    sampleBrands.splice(index, 1);
  }
}; 