import { Tag, CreateTagData } from '../../types/tag';

// Sample data
const sampleTags: Tag[] = [
  {
    id: 1,
    name: "Summer Collection",
    slug: "summer-collection"
  },
  {
    id: 2,
    name: "New Arrivals",
    slug: "new-arrivals"
  },
  {
    id: 3,
    name: "Sale",
    slug: "sale"
  },
  {
    id: 4,
    name: "Best Sellers",
    slug: "best-sellers"
  },
  {
    id: 5,
    name: "Featured",
    slug: "featured"
  }
];

export const tagApi = {
  async getAllTags(): Promise<Tag[]> {
    return sampleTags;
  },

  async createTag(data: CreateTagData): Promise<Tag> {
    const newTag: Tag = {
      id: Math.max(...sampleTags.map(t => t.id || 0)) + 1,
      name: data.name,
      slug: data.name.toLowerCase().replace(/\s+/g, '-')
    };
    
    sampleTags.push(newTag);
    return newTag;
  },

  async updateTag(id: number, data: Partial<CreateTagData>): Promise<Tag> {
    const tag = sampleTags.find(t => t.id === id);
    if (!tag) {
      throw new Error('Tag not found');
    }

    if (data.name) {
      tag.name = data.name;
      tag.slug = data.name.toLowerCase().replace(/\s+/g, '-');
    }

    return tag;
  },

  async deleteTag(id: number): Promise<void> {
    const index = sampleTags.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Tag not found');
    }
    sampleTags.splice(index, 1);
  }
}; 