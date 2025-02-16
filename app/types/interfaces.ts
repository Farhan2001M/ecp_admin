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
  category: string;
  price: number;
  description: string;
  sku: string;
  images: string[]; // Assuming images are stored as URLs
  videos: string[]; // Assuming videos are stored as URLs
  inStock: boolean;
  ratings: number;
  dimensions: string;
}