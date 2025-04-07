import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addProduct,
  deleteProduct,
  getProductById,
  getProducts,
  getProductsByCategory,
  getProductsByPriceRange,
  updateProduct,
} from "../services/productService";
import { Product, ProductFormData } from "../types";

// Query keys
export const QUERY_KEYS = {
  PRODUCTS: "products",
  PRODUCT_DETAIL: "product",
  PRODUCTS_BY_CATEGORY: "productsByCategory",
  PRODUCTS_BY_PRICE: "productsByPrice",
};

export const useProducts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS],
    queryFn: getProducts,
  });
};

export const useProductById = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_DETAIL, id],
    queryFn: () => getProductById(id),
    enabled: !!id,
    retry: false,
  });
};

export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS_BY_CATEGORY, category],
    queryFn: () => getProductsByCategory(category),
    enabled: !!category,
  });
};

export const useProductsByPriceRange = (
  minPrice: number,
  maxPrice: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS_BY_PRICE, minPrice, maxPrice],
    queryFn: () => getProductsByPriceRange(minPrice, maxPrice),
    enabled: enabled && minPrice >= 0 && maxPrice > 0 && maxPrice >= minPrice,
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: ProductFormData) => addProduct(productData),
    onSuccess: () => {
      // Invalidate products queries to force a refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCTS_BY_CATEGORY],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCTS_BY_PRICE],
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ProductFormData>;
    }) => updateProduct(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific product query
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCT_DETAIL, variables.id],
      });

      // Invalidate all product lists
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCTS_BY_CATEGORY],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCTS_BY_PRICE],
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      // Invalidate all product lists
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCTS_BY_CATEGORY],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCTS_BY_PRICE],
      });
    },
  });
};
