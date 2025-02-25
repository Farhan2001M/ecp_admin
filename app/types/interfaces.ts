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
  tagline: string;
  brand: string;
  categoryID: { _id: string; name: string } | string;  // Allow both cases
  price: number;
  totalStock: number;
  ratings: number;
  dimensions: string;
  description: string;
  images: string[]; 
  videos: string; 
  inStock: boolean;
}