import { useState } from "react";
import { StyleSheet, View, ScrollView, Image, TextStyle } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Button,
  Card,
  Title,
  Paragraph,
  Chip,
  Dialog,
  Portal,
  Text,
  Snackbar,
} from "react-native-paper";
import { useProductById, useDeleteProduct } from "@/src/hooks/useProducts";
import { Loader } from "@/src/components/common/Loader";
import { ErrorDisplay } from "@/src/components/common/ErrorDisplay";
import { appColors, spacing, typography } from "@/src/theme";
import { format } from "date-fns";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const productId = id as string;

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const {
    data: product,
    isLoading,
    error,
    isError,
  } = useProductById(productId);

  const { mutate: deleteProductMutation, isPending: isDeleting } =
    useDeleteProduct();

  const handleEditProduct = () => {
    router.push(`/product/edit/${productId}`);
  };

  const handleDeleteConfirmation = () => {
    setDeleteDialogVisible(true);
  };

  const handleDeleteProduct = () => {
    deleteProductMutation(productId, {
      onSuccess: () => {
        setDeleteDialogVisible(false);
        setSnackbarMessage("Product deleted successfully");
        setSnackbarVisible(true);

        setTimeout(() => {
          router.replace("/");
        }, 1500);
      },
      onError: (error) => {
        setDeleteDialogVisible(false);
        setSnackbarMessage(`Error: ${error.message}`);
        setSnackbarVisible(true);
      },
    });
  };

  const formatDate = (date?: Date) => {
    if (!date) return "";
    return format(date, "MMM dd, yyyy");
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !product) {
    return (
      <ErrorDisplay
        message={error?.message || "Product not found"}
        onGoBack={() => router.back()}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {product.imageUrl ? (
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Title>No Image</Title>
          </View>
        )}

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title as TextStyle}>{product.name}</Title>

            <View style={styles.priceCategory}>
              <Chip icon="tag" style={styles.chip}>
                {product.category}
              </Chip>
              <Title style={styles.price}>${product.price.toFixed(2)}</Title>
            </View>

            <Title style={styles.sectionTitle as TextStyle}>Description</Title>
            <Paragraph style={styles.description}>
              {product.description}
            </Paragraph>

            <View style={styles.dateContainer}>
              {product.createdAt && (
                <Text style={styles.dateText}>
                  Added: {formatDate(product.createdAt)}
                </Text>
              )}

              {product.updatedAt && product.updatedAt !== product.createdAt && (
                <Text style={styles.dateText}>
                  Last updated: {formatDate(product.updatedAt)}
                </Text>
              )}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained-tonal"
          icon="pencil"
          onPress={handleEditProduct}
          style={[styles.button, styles.editButton]}
        >
          Edit
        </Button>

        <Button
          mode="contained"
          icon="delete"
          onPress={handleDeleteConfirmation}
          style={[styles.button, styles.deleteButton]}
          buttonColor={appColors.error}
          loading={isDeleting}
          disabled={isDeleting}
        >
          Delete
        </Button>
      </View>

      {/* Delete confirmation dialog */}
      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Delete Product</Dialog.Title>
          <Dialog.Content>
            <Text>
              Are you sure you want to delete "{product.name}"? This action
              cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>
              Cancel
            </Button>
            <Button
              onPress={handleDeleteProduct}
              textColor={appColors.error}
              loading={isDeleting}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

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
    backgroundColor: appColors.background,
  },
  image: {
    width: "100%",
    height: 250,
    backgroundColor: "#e0e0e0",
  },
  placeholderImage: {
    width: "100%",
    height: 250,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    margin: spacing.md,
    elevation: 4,
    borderRadius: 8,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.subtitle,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  priceCategory: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  chip: {
    height: 30,
  },
  price: {
    fontSize: 24,
    color: appColors.primary,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  dateContainer: {
    marginTop: spacing.lg,
  },
  dateText: {
    marginTop: spacing.xs,
    color: "#757575",
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    padding: spacing.md,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: "#f0f0f0",
  },
  deleteButton: {
    backgroundColor: "#c70000",
  },
});
