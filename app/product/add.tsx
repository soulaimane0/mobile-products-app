import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Snackbar, Title } from "react-native-paper";
import ProductForm from "@/src/components/products/ProductForm";
import { ProductFormData } from "@/src/types";
import { useAddProduct } from "@/src/hooks/useProducts";
import { appColors, spacing } from "@/src/theme";

export default function AddProductScreen() {
  const router = useRouter();
  const { mutate: addProduct, isPending } = useAddProduct();

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSubmit = (data: ProductFormData) => {
    addProduct(data, {
      onSuccess: () => {
        setSnackbarMessage("Product added successfully");
        setSnackbarVisible(true);

        setTimeout(() => {
          router.replace("/");
        }, 1500);
      },
      onError: (error) => {
        setSnackbarMessage(`Error: ${error.message}`);
        setSnackbarVisible(true);
      },
    });
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Add New Product</Title>

      <ProductForm
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        submitLabel="Add Product"
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
