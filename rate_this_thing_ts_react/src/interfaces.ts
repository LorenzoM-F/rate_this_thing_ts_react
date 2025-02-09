export interface Item {
    id: number;
    name: string;
    categoryName: string;
    price: number;
    description: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface Review {
    userId: number;
    rating: number;
    reviewDate: string;
    reviewText: string;
}
