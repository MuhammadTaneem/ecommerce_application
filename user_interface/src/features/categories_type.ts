export type CategoryType = {
    id: number;
    label: string;
    slug: string;
    parent: number | null;
    description: string;
    image: string | null;
    subcategories: CategoryType[];
};