export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductFormData = Omit<Product, "id" | "createdAt" | "updatedAt">;

export interface CategoryOption {
  label: string;
  value: string;
}

export interface PriceRangeOption {
  label: string;
  min: number;
  max: number;
}

export type FilterType = "category" | "price" | "none";

export interface FilterState {
  type: FilterType;
  category?: string;
  priceRange?: {
    min: number;
    max: number;
    label: string;
  };
}

export type SortOption = "name" | "price_asc" | "price_desc" | "newest";
