export interface Campaign {
    id?: string;
    name: string;
    description: string;
    image: string;
    startDate: Date;
    endDate: Date;
    is_published: boolean;
} 