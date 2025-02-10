import { create } from "zustand";
import { Category } from "../types/interfaces";

interface CategoryStore {
  categories: Category[];
  refreshTrigger: number; // ✅ NEW: Used to refetch categories
  fetchCategories: () => Promise<void>;
  triggerRefresh: () => void;
  addCategory: (category: Category) => void;
  updateCategory: (updatedCategory: Category) => void;
  removeCategory: (id: string) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  refreshTrigger: 0, // ✅ Initial value

  fetchCategories: async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      const data = await res.json();
      set({ categories: data });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  },

  triggerRefresh: () => {
    set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })); // ✅ Increment to trigger re-fetch
  },

  addCategory: (category) => {
    set((state) => ({
      categories: [category, ...state.categories],
    }));
    set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })); // ✅ Ensure UI updates
  },

  updateCategory: (updatedCategory) => {
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat._id === updatedCategory._id ? updatedCategory : cat
      ),
    }));
    set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })); // ✅ Trigger fetch
  },

  removeCategory: (id) => {
    set((state) => ({
      categories: state.categories.filter((category) => category._id !== id),
    }));
    set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })); // ✅ Ensure UI updates
  },
}));
