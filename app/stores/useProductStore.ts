// stores/useProductStore.ts
import { create } from "zustand";
import { Product } from "../types/interfaces";

interface ProductStore {
  products: Product[];
  refreshTrigger: number; // Used to refetch products
  fetchProducts: () => Promise<void>;
  triggerRefresh: () => void;
  addProduct: (product: Product) => void;
  updateProduct: (updatedProduct: Product) => void;
  removeProduct: (id: string) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  refreshTrigger: 0, // Initial value
  fetchProducts: async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      set({ products: data });
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  },
  triggerRefresh: () => {
    set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })); // Increment to trigger re-fetch
  },
  addProduct: (product) => {
    set((state) => ({
      products: [product, ...state.products],
    }));
    set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })); // Ensure UI updates
  },
  updateProduct: (updatedProduct) => {
    set((state) => ({
      products: state.products.map((prod) =>
        prod._id === updatedProduct._id ? updatedProduct : prod
      ),
    }));
    set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })); // Trigger fetch
  },
  removeProduct: (id) => {
    set((state) => ({
      products: state.products.filter((product) => product._id !== id),
    }));
    set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })); // Ensure UI updates
  },
}));