import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  FirestoreError,
  getDoc,
  getDocs,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Product, ProductFormData } from "../types";

const COLLECTION_NAME = "products";
const productsCollection = collection(db, COLLECTION_NAME);

const convertProduct = (doc: QueryDocumentSnapshot<DocumentData>): Product => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name || "",
    description: data.description || "",
    price: data.price || 0,
    imageUrl: data.imageUrl || "",
    category: data.category || "",
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  };
};

const handleFirestoreError = (error: unknown, customMessage: string): never => {
  console.error(`${customMessage}:`, error);
  if (error instanceof FirestoreError) {
    throw new Error(`${customMessage}: ${error.message}`);
  }
  throw new Error(customMessage);
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const snapshot = await getDocs(
      query(productsCollection, orderBy("updatedAt", "desc"))
    );
    return snapshot.docs.map(convertProduct);
  } catch (error) {
    return handleFirestoreError(error, "Failed to fetch products");
  }
};

export const getProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  try {
    if (!category) return [];

    const q = query(
      productsCollection,
      where("category", "==", category),
      orderBy("updatedAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(convertProduct);
  } catch (error) {
    return handleFirestoreError(
      error,
      `Failed to fetch products in category ${category}`
    );
  }
};

export const getProductsByPriceRange = async (
  minPrice: number,
  maxPrice: number
): Promise<Product[]> => {
  try {
    const snapshot = await getDocs(
      query(
        productsCollection,
        where("price", ">=", minPrice),
        where("price", "<=", maxPrice),
        orderBy("price", "asc")
      )
    );
    return snapshot.docs.map(convertProduct);
  } catch (error) {
    return handleFirestoreError(
      error,
      `Failed to fetch products in price range $${minPrice} - $${maxPrice}`
    );
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(`Product with ID ${id} not found`);
    }

    return convertProduct(docSnap as QueryDocumentSnapshot<DocumentData>);
  } catch (error) {
    return handleFirestoreError(error, `Failed to fetch product with ID ${id}`);
  }
};

export const addProduct = async (product: ProductFormData): Promise<string> => {
  try {
    const docRef = await addDoc(productsCollection, {
      ...product,
      price: Number(product.price),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    return handleFirestoreError(error, "Failed to add product");
  }
};

export const updateProduct = async (
  id: string,
  product: Partial<ProductFormData>
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);

    // If price is provided as string, convert it to number
    const updates = {
      ...product,
      price: product.price !== undefined ? Number(product.price) : undefined,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, `Failed to update product with ID ${id}`);
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, `Failed to delete product with ID ${id}`);
  }
};
