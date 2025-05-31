export interface Brand {
  id: number;
  name: string;
  logo?: string;
  description?: string;
}

export const sampleBrands: Brand[] = [
  {
    id: 1,
    name: "Nike",
    logo: "https://example.com/nike-logo.png",
    description: "Just Do It"
  },
  {
    id: 2,
    name: "Adidas",
    logo: "https://example.com/adidas-logo.png",
    description: "Impossible Is Nothing"
  },
  {
    id: 3,
    name: "Puma",
    logo: "https://example.com/puma-logo.png",
    description: "Forever Faster"
  },
  {
    id: 4,
    name: "Under Armour",
    logo: "https://example.com/ua-logo.png",
    description: "The Only Way Is Through"
  },
  {
    id: 5,
    name: "New Balance",
    logo: "https://example.com/nb-logo.png",
    description: "Fearlessly Independent"
  },
  {
    id: 6,
    name: "Reebok",
    logo: "https://example.com/reebok-logo.png",
    description: "Be More Human"
  },
  {
    id: 7,
    name: "Asics",
    logo: "https://example.com/asics-logo.png",
    description: "Sound Mind, Sound Body"
  },
  {
    id: 8,
    name: "Converse",
    logo: "https://example.com/converse-logo.png",
    description: "Made By You"
  }
]; 