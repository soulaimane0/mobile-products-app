import { useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Searchbar } from "react-native-paper";
import { ProductCard } from "@/src/components/products/ProductCard";
import { ProductFilters } from "@/src/components/products/ProductFilters";
import { Loader } from "@/src/components/common/Loader";
import { EmptyState } from "@/src/components/common/EmptyState";
import { ErrorDisplay } from "@/src/components/common/ErrorDisplay";
import {
  useProducts,
  useProductsByCategory,
  useProductsByPriceRange,
} from "@/src/hooks/useProducts";
import {
  FilterState,
  Product,
  CategoryOption,
  PriceRangeOption,
} from "@/src/types";
import { appColors, spacing } from "@/src/theme";

const CATEGORIES: CategoryOption[] = [
  { label: "Electronics", value: "Electronics" },
  { label: "Clothing", value: "Clothing" },
  { label: "Books", value: "Books" },
  { label: "Home", value: "Home" },
  { label: "Food", value: "Food" },
  { label: "Other", value: "Other" },
];

const PRICE_RANGES: PriceRangeOption[] = [
  { min: 0, max: 50, label: "Under $50" },
  { min: 50, max: 100, label: "$50 - $100" },
  { min: 100, max: 500, label: "$100 - $500" },
  { min: 500, max: 100000, label: "Over $500" },
];

export default function ProductsScreen() {
  const router = useRouter();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterState>({
    type: "none",
  });

  // Query data based on filters
  const productsQuery = useProducts();
  const productsByCategoryQuery = useProductsByCategory(
    activeFilter.type === "category" ? activeFilter.category || "" : ""
  );
  const productsByPriceQuery = useProductsByPriceRange(
    activeFilter.type === "price" ? activeFilter.priceRange?.min || 0 : 0,
    activeFilter.type === "price" ? activeFilter.priceRange?.max || 0 : 0,
    activeFilter.type === "price"
  );

  // Determine which query data to use
  let products: Product[] = [];
  let isLoading = false;
  let error: Error | null = null;

  if (activeFilter.type === "category") {
    products = productsByCategoryQuery.data || [];
    isLoading = productsByCategoryQuery.isLoading;
    error = productsByCategoryQuery.error as Error | null;
  } else if (activeFilter.type === "price") {
    products = productsByPriceQuery.data || [];
    isLoading = productsByPriceQuery.isLoading;
    error = productsByPriceQuery.error as Error | null;
  } else {
    products = productsQuery.data || [];
    isLoading = productsQuery.isLoading;
    error = productsQuery.error as Error | null;
  }

  // Filter products by search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle filter change
  const handleFilterChange = (filter: FilterState) => {
    setActiveFilter(filter);
  };

  // Clear filters
  const clearFilters = () => {
    setActiveFilter({ type: "none" });
  };

  // Navigate to product details
  const goToProductDetails = useCallback(
    (id: string) => {
      router.push(`/product/${id}`);
    },
    [router]
  );

  // Navigate to add product page
  const goToAddProduct = () => {
    router.push("/product/add");
  };

  // Retry fetching data
  const handleRetry = () => {
    if (activeFilter.type === "category") {
      productsByCategoryQuery.refetch?.();
    } else if (activeFilter.type === "price") {
      productsByPriceQuery.refetch?.();
    } else {
      productsQuery.refetch?.();
    }
  };

  // Render empty state
  const renderEmptyState = () => (
    <EmptyState
      title="No products found"
      message="Try changing your filters or add a new product"
      buttonText="Add Product"
      onButtonPress={goToAddProduct}
    />
  );

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <Searchbar
        placeholder="Search products"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {/* Filter and Add buttons */}
      <View style={styles.actionContainer}>
        <ProductFilters
          categories={CATEGORIES}
          priceRanges={PRICE_RANGES}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />

        <Button
          mode="contained"
          onPress={goToAddProduct}
          icon="plus"
          style={styles.addButton}
        >
          Add Product
        </Button>
      </View>

      {/* Loading indicator */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorDisplay
          message={`Error: ${error.message}`}
          onRetry={handleRetry}
        />
      ) : (
        /* Product list */
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => (
            <ProductCard product={item} onPress={goToProductDetails} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
    padding: spacing.md,
  },
  searchBar: {
    marginBottom: spacing.md,
    elevation: 2,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  addButton: {
    borderRadius: 8,
  },
  list: {
    paddingBottom: spacing.md,
  },
});
