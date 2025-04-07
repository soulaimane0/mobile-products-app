import { Product } from "@/src/types";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Chip, Paragraph, Title } from "react-native-paper";

interface ProductCardProps {
  product: Product;
  onPress: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
}) => {
  const handlePress = () => {
    onPress(product.id);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      testID={`product-card-${product.id}`}
    >
      <Card style={styles.card}>
        {product.imageUrl ? (
          <Card.Cover
            source={{ uri: product.imageUrl }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        ) : null}
        <Card.Content>
          <Title numberOfLines={1} style={styles.title}>
            {product.name}
          </Title>
          <Paragraph numberOfLines={2} style={styles.description}>
            {product.description}
          </Paragraph>
          <View style={styles.productDetails}>
            <Chip icon="tag" style={styles.chip}>
              {product.category}
            </Chip>
            <Title style={styles.price}>${product.price.toFixed(2)}</Title>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
  },
  cardImage: {
    height: 160,
    backgroundColor: "#e0e0e0",
  },
  title: {
    fontSize: 18,
    marginTop: 8,
    marginBottom: 4,
  },
  description: {
    color: "#666",
    marginBottom: 8,
  },
  productDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    color: "#3498db",
  },
  chip: {
    height: 28,
  },
});
