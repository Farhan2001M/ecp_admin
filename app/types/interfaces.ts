export interface Category {
  _id: string;
  name: string;
  servings: string[];
  servingsCount: number;
  productCount: number;
  isactive: boolean;
  highlighted: boolean;
}

export interface Product {
  _id: string;
  name: string;
  brand: string;
  categoryID: { _id: string; name: string } | string;  // Allow both cases
  price: number;
  description: string;
  totalStock: number;
  images: string[]; // Assuming images are stored as URLs
  videos: string[]; // Assuming videos are stored as URLs
  inStock: boolean;
  ratings: number;
  tagline: string;
  dimensions: string;
}