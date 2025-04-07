import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Snackbar, Title } from "react-native-paper";
import ProductForm from "@/src/components/products/ProductForm";
import { ProductFormData } from "@/src/types";
import { Loader } from "@/src/components/common/Loader";
import { ErrorDisplay } from "@/src/components/common/ErrorDisplay";
import { useProductById, useUpdateProduct } from "@/src/hooks/useProducts";
import { appColors, spacing } from "@/src/theme";

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const productId = id as string;

  const { data: product, isLoading, error } = useProductById(productId);
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSubmit = (data: ProductFormData) => {
    updateProduct(
      { id: productId, data },
      {
        onSuccess: () => {
          setSnackbarMessage("Product updated successfully");
          setSnackbarVisible(true);

          setTimeout(() => {
            router.replace(`/product/${productId}`);
          }, 1500);
        },
        onError: (error) => {
          setSnackbarMessage(`Error: ${error.message}`);
          setSnackbarVisible(true);
        },
      }
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error || !product) {
    return (
      <ErrorDisplay
        message="Error loading product data"
        onGoBack={() => router.back()}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Edit Product</Title>

      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        submitLabel="Update Product"
      />

      {/* Snackbar for notifications */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: "OK",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.surface,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: spacing.md,
  },
});
