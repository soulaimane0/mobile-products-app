import { CategoryOption, FilterState, PriceRangeOption } from "@/src/types";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Chip, Divider, Menu } from "react-native-paper";

interface ProductFiltersProps {
  categories: CategoryOption[];
  priceRanges: PriceRangeOption[];
  activeFilter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  onClearFilters: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  priceRanges,
  activeFilter,
  onFilterChange,
  onClearFilters,
}) => {
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

  const handleCategoryFilter = (category: string) => {
    onFilterChange({
      type: "category",
      category,
    });
    setFilterMenuVisible(false);
  };

  const handlePriceRangeFilter = (range: PriceRangeOption) => {
    onFilterChange({
      type: "price",
      priceRange: {
        min: range.min,
        max: range.max,
        label: range.label,
      },
    });
    setFilterMenuVisible(false);
  };

  return (
    <View>
      <View style={styles.actionContainer}>
        <Menu
          visible={filterMenuVisible}
          onDismiss={() => setFilterMenuVisible(false)}
          anchor={
            <Button
              mode="contained-tonal"
              onPress={() => setFilterMenuVisible(true)}
              icon="filter-variant"
            >
              Filter
            </Button>
          }
        >
          <Menu.Item title="Filter by Category" disabled />
          <Divider />
          {categories.map((category) => (
            <Menu.Item
              key={category.value}
              title={category.label}
              onPress={() => handleCategoryFilter(category.value)}
              titleStyle={
                activeFilter.type === "category" &&
                activeFilter.category === category.value
                  ? { color: "#3498db" }
                  : {}
              }
            />
          ))}
          <Divider />
          <Menu.Item title="Filter by Price" disabled />
          <Divider />
          {priceRanges.map((range) => (
            <Menu.Item
              key={range.label}
              title={range.label}
              onPress={() => handlePriceRangeFilter(range)}
              titleStyle={
                activeFilter.type === "price" &&
                activeFilter.priceRange?.label === range.label
                  ? { color: "#3498db" }
                  : {}
              }
            />
          ))}
          <Divider />
          <Menu.Item
            title="Clear Filters"
            onPress={() => {
              onClearFilters();
              setFilterMenuVisible(false);
            }}
            leadingIcon="refresh"
          />
        </Menu>
      </View>

      {/* Active filter indicators */}
      {activeFilter.type !== "none" && (
        <View style={styles.activeFilter}>
          {activeFilter.type === "category" && activeFilter.category && (
            <Chip onClose={onClearFilters} style={styles.filterChip} icon="tag">
              Category: {activeFilter.category}
            </Chip>
          )}
          {activeFilter.type === "price" && activeFilter.priceRange && (
            <Chip
              onClose={onClearFilters}
              style={styles.filterChip}
              icon="cash"
            >
              Price: {activeFilter.priceRange.label}
            </Chip>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  activeFilter: {
    flexDirection: "row",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
});
