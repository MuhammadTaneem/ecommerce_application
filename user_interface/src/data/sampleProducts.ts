import { Product } from '../types';

export const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Premium Cotton T-Shirt",
    base_price: "2000.00",
    stock_quantity: 122,
    has_variants: true,
    short_description: "Comfortable premium cotton t-shirt with modern design",
    discount_price: "1900.00",
    category: 2,
    key_features: ["100% Cotton", "Machine Washable", "Comfortable Fit"],
    description: {
      "Material": "100% premium cotton for maximum comfort",
      "Care": "Machine wash cold, tumble dry low",
      "Features": "Reinforced stitching for durability"
    },
    additional_info: {
      "Weight": "250g",
      "Country of Origin": "Bangladesh",
      "Style": "Casual"
    },
    thumbnail: "https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    brand: 1,
    tags: [
      {
        id: 1,
        name: "Regular Fit",
        slug: "regular-fit"
      },
      {
        id: 6,
        name: "Cotton",
        slug: "cotton"
      }
    ],
    created_at: "2025-05-29T01:56:16.106141+06:00",
    updated_at: "2025-05-29T01:56:16.106241+06:00",
    is_active: true,
    is_deleted: false,
    featured: true,
    images: [
      {
        id: 1,
        image: "https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      },
      {
        id: 2,
        image: "https://images.pexels.com/photos/5384422/pexels-photo-5384422.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      }
    ],
    skus: [
      {
        id: 1,
        product: 1,
        sku_code: "faa94757-1979-41ea-8f50-de032f5ec769",
        price: "2000.00",
        discount_price: "1950.00",
        stock_quantity: 120,
        variants_dict: {
          "Color": "Blue",
          "Size": "L"
        },
        variants: [2, 12]
      },
      {
        id: 2,
        product: 1,
        sku_code: "defb0471-089d-48ad-9319-1a8a3d6d3c6a",
        price: "2000.00",
        discount_price: "1950.00",
        stock_quantity: 120,
        variants_dict: {
          "Color": "Green",
          "Size": "XXL"
        },
        variants: [3, 14]
      }
    ],
    average_rating: 4.5,
    rating_count: 120
  },
  {
    id: 2,
    name: "Slim Fit Denim Jeans",
    base_price: "3500.00",
    stock_quantity: 85,
    has_variants: true,
    short_description: "Premium quality slim fit denim jeans for a modern look",
    discount_price: "3200.00",
    category: 3,
    key_features: ["Slim Fit", "Premium Denim", "Durable Construction"],
    description: {
      "Material": "98% cotton, 2% elastane for stretch",
      "Care": "Machine wash cold, inside out",
      "Features": "Five-pocket styling with zip fly and button closure"
    },
    additional_info: {
      "Weight": "450g",
      "Country of Origin": "Turkey",
      "Style": "Casual"
    },
    thumbnail: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    brand: 2,
    tags: [
      {
        id: 2,
        name: "Slim Fit",
        slug: "slim-fit"
      },
      {
        id: 7,
        name: "Denim",
        slug: "denim"
      }
    ],
    created_at: "2025-05-15T11:23:45.106141+06:00",
    updated_at: "2025-05-15T11:23:45.106241+06:00",
    is_active: true,
    is_deleted: false,
    featured: true,
    images: [
      {
        id: 3,
        image: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      },
      {
        id: 4,
        image: "https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      }
    ],
    skus: [
      {
        id: 3,
        product: 2,
        sku_code: "c5a3e752-7c67-4edb-a838-25ff9e5dbc1e",
        price: "3500.00",
        discount_price: "3200.00",
        stock_quantity: 30,
        variants_dict: {
          "Color": "Blue",
          "Size": "32"
        },
        variants: [2, 15]
      },
      {
        id: 4,
        product: 2,
        sku_code: "b2a1d8f3-5e72-4b9a-9c45-8d7fe3e5db1f",
        price: "3500.00",
        discount_price: "3200.00",
        stock_quantity: 25,
        variants_dict: {
          "Color": "Black",
          "Size": "34"
        },
        variants: [4, 16]
      },
      {
        id: 5,
        product: 2,
        sku_code: "a1b2c3d4-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
        price: "3500.00",
        discount_price: "3200.00",
        stock_quantity: 30,
        variants_dict: {
          "Color": "Gray",
          "Size": "30"
        },
        variants: [5, 17]
      }
    ],
    average_rating: 4.2,
    rating_count: 85
  },
  {
    id: 3,
    name: "Floral Summer Dress",
    base_price: "2800.00",
    stock_quantity: 42,
    has_variants: true,
    short_description: "Beautiful floral pattern summer dress with comfortable fit",
    discount_price: undefined,
    category: 4,
    key_features: ["Floral Pattern", "Breathable Fabric", "Perfect for Summer"],
    description: {
      "Material": "100% rayon for a light, airy feel",
      "Care": "Hand wash cold, line dry",
      "Features": "Adjustable straps and elastic waistband for perfect fit"
    },
    additional_info: {
      "Weight": "200g",
      "Country of Origin": "India",
      "Style": "Casual, Summer"
    },
    thumbnail: "https://images.pexels.com/photos/994234/pexels-photo-994234.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    brand: 3,
    tags: [
      {
        id: 3,
        name: "Summer",
        slug: "summer"
      },
      {
        id: 8,
        name: "Floral",
        slug: "floral"
      },
      {
        id: 9,
        name: "Dress",
        slug: "dress"
      }
    ],
    created_at: "2025-04-10T09:15:30.106141+06:00",
    updated_at: "2025-04-10T09:15:30.106241+06:00",
    is_active: true,
    is_deleted: false,
    featured: false,
    images: [
      {
        id: 5,
        image: "https://images.pexels.com/photos/994234/pexels-photo-994234.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      },
      {
        id: 6,
        image: "https://images.pexels.com/photos/972995/pexels-photo-972995.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      }
    ],
    skus: [
      {
        id: 6,
        product: 3,
        sku_code: "d4e5f6g7-8h9i-0j1k-2l3m-4n5o6p7q8r9s",
        price: "2800.00",
        discount_price: undefined,
        stock_quantity: 15,
        variants_dict: {
          "Color": "Blue",
          "Size": "S"
        },
        variants: [2, 18]
      },
      {
        id: 7,
        product: 3,
        sku_code: "t1u2v3w4-5x6y-7z8a-9b0c-1d2e3f4g5h6i",
        price: "2800.00",
        discount_price: undefined,
        stock_quantity: 12,
        variants_dict: {
          "Color": "Pink",
          "Size": "M"
        },
        variants: [6, 19]
      },
      {
        id: 8,
        product: 3,
        sku_code: "j7k8l9m0-n1o2-p3q4-r5s6-t7u8v9w0x1y2",
        price: "2800.00",
        discount_price: undefined,
        stock_quantity: 15,
        variants_dict: {
          "Color": "White",
          "Size": "L"
        },
        variants: [7, 12]
      }
    ],
    average_rating: 4.8,
    rating_count: 65
  },
  {
    id: 4,
    name: "Leather Jacket",
    base_price: "8500.00",
    stock_quantity: 18,
    has_variants: true,
    short_description: "Premium quality leather jacket with modern design",
    discount_price: "7200.00",
    category: 5,
    key_features: ["Genuine Leather", "Durable Construction", "Multiple Pockets"],
    description: {
      "Material": "100% genuine leather exterior, polyester lining",
      "Care": "Professional leather cleaning only",
      "Features": "Multiple pockets, heavy-duty zipper, adjustable cuffs"
    },
    additional_info: {
      "Weight": "1.2kg",
      "Country of Origin": "Italy",
      "Style": "Casual, Biker"
    },
    thumbnail: "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    brand: 4,
    tags: [
      {
        id: 4,
        name: "Leather",
        slug: "leather"
      },
      {
        id: 10,
        name: "Winter",
        slug: "winter"
      },
      {
        id: 11,
        name: "Jacket",
        slug: "jacket"
      }
    ],
    created_at: "2025-03-25T14:42:18.106141+06:00",
    updated_at: "2025-03-25T14:42:18.106241+06:00",
    is_active: true,
    is_deleted: false,
    featured: true,
    images: [
      {
        id: 7,
        image: "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      },
      {
        id: 8,
        image: "https://images.pexels.com/photos/1336873/pexels-photo-1336873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      }
    ],
    skus: [
      {
        id: 9,
        product: 4,
        sku_code: "z3a4b5c6-d7e8-f9g0-h1i2-j3k4l5m6n7o8",
        price: "8500.00",
        discount_price: "7200.00",
        stock_quantity: 6,
        variants_dict: {
          "Color": "Black",
          "Size": "M"
        },
        variants: [4, 19]
      },
      {
        id: 10,
        product: 4,
        sku_code: "p9q0r1s2-t3u4-v5w6-x7y8-z9a0b1c2d3e4",
        price: "8500.00",
        discount_price: "7200.00",
        stock_quantity: 5,
        variants_dict: {
          "Color": "Brown",
          "Size": "L"
        },
        variants: [8, 12]
      },
      {
        id: 11,
        product: 4,
        sku_code: "f5g6h7i8-j9k0-l1m2-n3o4-p5q6r7s8t9u0",
        price: "8500.00",
        discount_price: "7200.00",
        stock_quantity: 7,
        variants_dict: {
          "Color": "Brown",
          "Size": "XL"
        },
        variants: [8, 13]
      }
    ],
    average_rating: 4.9,
    rating_count: 42
  },
  {
    id: 5,
    name: "Running Shoes",
    base_price: "4500.00",
    stock_quantity: 0,
    has_variants: true,
    short_description: "Lightweight and comfortable running shoes for professional athletes",
    discount_price: undefined,
    category: 6,
    key_features: ["Lightweight Design", "Breathable Mesh", "Cushioned Sole"],
    description: {
      "Material": "Synthetic mesh upper, rubber sole",
      "Care": "Wipe clean with damp cloth",
      "Features": "Cushioned insole, reinforced heel support, breathable design"
    },
    additional_info: {
      "Weight": "300g per shoe",
      "Country of Origin": "Vietnam",
      "Style": "Athletic, Running"
    },
    thumbnail: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    brand: 5,
    tags: [
      {
        id: 5,
        name: "Running",
        slug: "running"
      },
      {
        id: 12,
        name: "Sports",
        slug: "sports"
      },
      {
        id: 13,
        name: "Shoes",
        slug: "shoes"
      }
    ],
    created_at: "2025-05-02T16:30:45.106141+06:00",
    updated_at: "2025-05-02T16:30:45.106241+06:00",
    is_active: true,
    is_deleted: false,
    featured: false,
    images: [
      {
        id: 9,
        image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      },
      {
        id: 10,
        image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      }
    ],
    skus: [
      {
        id: 12,
        product: 5,
        sku_code: "v1w2x3y4-z5a6-b7c8-d9e0-f1g2h3i4j5k6",
        price: "4500.00",
        discount_price: undefined,
        stock_quantity: 0,
        variants_dict: {
          "Color": "Black",
          "Size": "UK 8"
        },
        variants: [4, 20]
      },
      {
        id: 13,
        product: 5,
        sku_code: "l7m8n9o0-p1q2-r3s4-t5u6-v7w8x9y0z1a2",
        price: "4500.00",
        discount_price: undefined,
        stock_quantity: 0,
        variants_dict: {
          "Color": "White",
          "Size": "UK 9"
        },
        variants: [7, 21]
      },
      {
        id: 14,
        product: 5,
        sku_code: "b3c4d5e6-f7g8-h9i0-j1k2-l3m4n5o6p7q8",
        price: "4500.00",
        discount_price: undefined,
        stock_quantity: 0,
        variants_dict: {
          "Color": "Red",
          "Size": "UK 10"
        },
        variants: [9, 22]
      }
    ],
    average_rating: 4.6,
    rating_count: 78
  }
];

export default sampleProducts; 