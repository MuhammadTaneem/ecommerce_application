import { Category } from '../types';

export const categoryData: Category[] = [
  {
    "id": 1,
    "label": "man",
    "slug": "man",
    "parent": null,
    "description": "Category for men",
    "image": null,
    "subcategories": [
      {
        "id": 3,
        "label": "shirt",
        "slug": "man-shirt",
        "parent": 1,
        "description": "Men's shirts",
        "image": null,
        "subcategories": [
          {
            "id": 7,
            "label": "formal",
            "slug": "man-shirt-formal",
            "parent": 3,
            "description": "Formal shirts for men",
            "image": null,
            "subcategories": []
          },
          {
            "id": 8,
            "label": "casual",
            "slug": "man-shirt-casual",
            "parent": 3,
            "description": "Casual shirts for men",
            "image": null,
            "subcategories": []
          }
        ]
      },
      {
        "id": 6,
        "label": "pant",
        "slug": "man-pant",
        "parent": 1,
        "description": "Men's pants",
        "image": null,
        "subcategories": [
          {
            "id": 9,
            "label": "casual",
            "slug": "man-pant-casual",
            "parent": 6,
            "description": "Casual pants for men",
            "image": null,
            "subcategories": []
          },
          {
            "id": 10,
            "label": "formal",
            "slug": "man-pant-formal",
            "parent": 6,
            "description": "Formal pants for men",
            "image": null,
            "subcategories": []
          }
        ]
      },
      {
        "id": 13,
        "label": "t-shirt",
        "slug": "man-tshirt",
        "parent": 1,
        "description": "Men's T-shirts",
        "image": null,
        "subcategories": [
          {
            "id": 21,
            "label": "graphic",
            "slug": "man-tshirt-graphic",
            "parent": 13,
            "description": "Graphic T-shirts for men",
            "image": null,
            "subcategories": []
          },
          {
            "id": 22,
            "label": "plain",
            "slug": "man-tshirt-plain",
            "parent": 13,
            "description": "Plain T-shirts for men",
            "image": null,
            "subcategories": []
          }
        ]
      },
      {
        "id": 15,
        "label": "jeans",
        "slug": "man-jeans",
        "parent": 1,
        "description": "Men's jeans",
        "image": null,
        "subcategories": []
      }
    ]
  },
  {
    "id": 2,
    "label": "woman",
    "slug": "woman",
    "parent": null,
    "description": "Category for women",
    "image": null,
    "subcategories": [
      {
        "id": 4,
        "label": "shirt",
        "slug": "woman-shirt",
        "parent": 2,
        "description": "Women's shirts",
        "image": null,
        "subcategories": []
      },
      {
        "id": 5,
        "label": "pant",
        "slug": "woman-pant",
        "parent": 2,
        "description": "Women's pants",
        "image": null,
        "subcategories": []
      },
      {
        "id": 11,
        "label": "dress",
        "slug": "woman-dress",
        "parent": 2,
        "description": "Women's dresses",
        "image": null,
        "subcategories": [
          {
            "id": 17,
            "label": "formal",
            "slug": "woman-dress-formal",
            "parent": 11,
            "description": "Formal dresses for women",
            "image": null,
            "subcategories": []
          },
          {
            "id": 18,
            "label": "casual",
            "slug": "woman-dress-casual",
            "parent": 11,
            "description": "Casual dresses for women",
            "image": null,
            "subcategories": []
          }
        ]
      },
      {
        "id": 12,
        "label": "skirt",
        "slug": "woman-skirt",
        "parent": 2,
        "description": "Women's skirts",
        "image": null,
        "subcategories": [
          {
            "id": 19,
            "label": "mini",
            "slug": "woman-skirt-mini",
            "parent": 12,
            "description": "Mini skirts for women",
            "image": null,
            "subcategories": []
          },
          {
            "id": 20,
            "label": "pencil",
            "slug": "woman-skirt-pencil",
            "parent": 12,
            "description": "Pencil skirts for women",
            "image": null,
            "subcategories": []
          }
        ]
      },
      {
        "id": 14,
        "label": "t-shirt",
        "slug": "woman-tshirt",
        "parent": 2,
        "description": "Women's T-shirts",
        "image": null,
        "subcategories": [
          {
            "id": 23,
            "label": "graphic",
            "slug": "woman-tshirt-graphic",
            "parent": 14,
            "description": "Graphic T-shirts for women",
            "image": null,
            "subcategories": []
          },
          {
            "id": 24,
            "label": "plain",
            "slug": "woman-tshirt-plain",
            "parent": 14,
            "description": "Plain T-shirts for women",
            "image": null,
            "subcategories": []
          }
        ]
      },
      {
        "id": 16,
        "label": "jeans",
        "slug": "woman-jeans",
        "parent": 2,
        "description": "Women's jeans",
        "image": null,
        "subcategories": []
      }
    ]
  }
];