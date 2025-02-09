export interface Items {
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

export interface User {
    id: 1,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    dateOfBirth: number[],
    profileImage: string,
    bio:  string
}
