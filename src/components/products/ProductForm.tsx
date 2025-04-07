import { Product, ProductFormData } from "@/src/types";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  Divider,
  HelperText,
  Menu,
  TextInput,
} from "react-native-paper";

// Default categories
const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Books",
  "Home",
  "Food",
  "Other",
];

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: ProductFormData) => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData = {},
  onSubmit,
  isSubmitting,
  submitLabel,
}) => {
  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [price, setPrice] = useState(
    initialData.price !== undefined ? initialData.price.toString() : ""
  );
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || "");
  const [category, setCategory] = useState(initialData.category || "");
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validateField(field);
  };

  const validateField = (field: string): boolean => {
    const newErrors = { ...errors };

    switch (field) {
      case "name":
        if (!name.trim()) {
          newErrors.name = "Name is required";
        } else {
          delete newErrors.name;
        }
        break;

      case "description":
        if (!description.trim()) {
          newErrors.description = "Description is required";
        } else {
          delete newErrors.description;
        }
        break;

      case "price":
        if (!price.trim()) {
          newErrors.price = "Price is required";
        } else if (isNaN(Number(price)) || Number(price) < 0) {
          newErrors.price =
            "Price must be a valid number greater than or equal to 0";
        } else {
          delete newErrors.price;
        }
        break;

      case "imageUrl":
        if (imageUrl && !isValidUrl(imageUrl)) {
          newErrors.imageUrl = "Please enter a valid URL";
        } else {
          delete newErrors.imageUrl;
        }
        break;

      case "category":
        if (!category && !customCategory) {
          newErrors.category = "Category is required";
        } else {
          delete newErrors.category;
        }
        break;
    }

    setErrors(newErrors);
    return !newErrors[field];
  };

  // Validate all form fields
  const validateForm = (): boolean => {
    let isValid = true;

    ["name", "description", "price", "imageUrl", "category"].forEach(
      (field) => {
        if (!validateField(field)) {
          isValid = false;
        }
      }
    );

    return isValid;
  };

  // Check if URL is valid
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Handle category selection
  const handleCategorySelect = (selectedCategory: string) => {
    if (selectedCategory === "custom") {
      setShowCustomCategoryInput(true);
      setCategory("");
    } else {
      setShowCustomCategoryInput(false);
      setCategory(selectedCategory);
      setCustomCategory("");
      validateField("category");
    }
    setCategoryMenuVisible(false);
  };

  // Handle custom category input
  const handleCustomCategoryChange = (text: string) => {
    setCustomCategory(text);
    if (text) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    // Mark all fields as touched
    const allTouched = [
      "name",
      "description",
      "price",
      "imageUrl",
      "category",
    ].reduce((acc, field) => ({ ...acc, [field]: true }), {});
    setTouched(allTouched);

    if (validateForm()) {
      onSubmit({
        name,
        description,
        price: Number(price),
        imageUrl: imageUrl || undefined,
        category: showCustomCategoryInput ? customCategory : category,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Name field */}
        <TextInput
          label="Product Name"
          value={name}
          onChangeText={setName}
          onBlur={() => handleBlur("name")}
          mode="outlined"
          error={!!(touched.name && errors.name)}
          style={styles.input}
          placeholder="Enter product name"
          disabled={isSubmitting}
        />
        {touched.name && errors.name && (
          <HelperText type="error">{errors.name}</HelperText>
        )}

        {/* Description field */}
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          onBlur={() => handleBlur("description")}
          mode="outlined"
          multiline
          numberOfLines={4}
          error={!!(touched.description && errors.description)}
          style={styles.input}
          placeholder="Enter product description"
          disabled={isSubmitting}
        />
        {touched.description && errors.description && (
          <HelperText type="error">{errors.description}</HelperText>
        )}

        {/* Price field */}
        <TextInput
          label="Price ($)"
          value={price}
          onChangeText={setPrice}
          onBlur={() => handleBlur("price")}
          mode="outlined"
          keyboardType="decimal-pad"
          error={!!(touched.price && errors.price)}
          style={styles.input}
          left={<TextInput.Affix text="$" />}
          placeholder="0.00"
          disabled={isSubmitting}
        />
        {touched.price && errors.price && (
          <HelperText type="error">{errors.price}</HelperText>
        )}

        {/* Image URL field */}
        <TextInput
          label="Image URL (optional)"
          value={imageUrl}
          onChangeText={setImageUrl}
          onBlur={() => handleBlur("imageUrl")}
          mode="outlined"
          error={!!(touched.imageUrl && errors.imageUrl)}
          style={styles.input}
          placeholder="https://example.com/image.jpg"
          disabled={isSubmitting}
        />
        {touched.imageUrl && errors.imageUrl && (
          <HelperText type="error">{errors.imageUrl}</HelperText>
        )}

        {/* Category field */}
        <View style={styles.categoryContainer}>
          <Menu
            visible={categoryMenuVisible}
            onDismiss={() => setCategoryMenuVisible(false)}
            anchor={
              <TextInput
                label="Category"
                value={showCustomCategoryInput ? customCategory : category}
                mode="outlined"
                error={!!(touched.category && errors.category)}
                style={styles.input}
                right={
                  <TextInput.Icon
                    icon="menu-down"
                    onPress={() => setCategoryMenuVisible(true)}
                    disabled={isSubmitting}
                  />
                }
                showSoftInputOnFocus={false}
                onPressIn={() => {
                  if (!showCustomCategoryInput) {
                    setCategoryMenuVisible(true);
                  }
                }}
                onChangeText={
                  showCustomCategoryInput
                    ? handleCustomCategoryChange
                    : undefined
                }
                disabled={
                  isSubmitting ||
                  (!showCustomCategoryInput && !categoryMenuVisible)
                }
              />
            }
          >
            {CATEGORIES.map((cat) => (
              <Menu.Item
                key={cat}
                title={cat}
                onPress={() => handleCategorySelect(cat)}
              />
            ))}
            <Divider />
            <Menu.Item
              title="Custom category..."
              onPress={() => handleCategorySelect("custom")}
            />
          </Menu>
          {touched.category && errors.category && (
            <HelperText type="error">{errors.category}</HelperText>
          )}
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={isSubmitting}
          loading={isSubmitting}
          style={styles.submitButton}
          icon="content-save"
        >
          {submitLabel}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 16,
  },
  input: {
    marginBottom: 8,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 32,
    paddingVertical: 6,
  },
});

export default ProductForm;
