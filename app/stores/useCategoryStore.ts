import { create } from "zustand";
import { Category } from "../types/interfaces";

interface CategoryStore {
  categories: Category[];
  refreshTrigger: number;
  fetchCategories: () => Promise<void>;
  triggerRefresh: () => void;
  addCategory: (category: Category) => void;
  updateCategory: (updatedCategory: Category) => void;
  removeCategory: (id: string) => void;
  startSale: (id: string, saleStartDate: string, saleEndDate: string, salePercentage: number) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  refreshTrigger: 0,

  startSale: async (id, saleStartDate, saleEndDate, salePercentage) => {
    try {
      const res = await fetch(`http://localhost:5000/api/categories/${id}/start-sale`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ saleStartDate, saleEndDate, salePercentage }),
      });
      const data = await res.json();
      if (res.ok) {
        set((state) => ({
          categories: state.categories.map((cat) => (cat._id === id ? data.category : cat)),
        }));
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Failed to start sale:", error);
    }
  },

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
    set((state) => ({ refreshTrigger: state.refreshTrigger + 1 }));
  },

  addCategory: (category) => {
    set((state) => ({
      categories: [category, ...state.categories],
    }));
    set((state) => ({ refreshTrigger: state.refreshTrigger + 1 }));
  },

  updateCategory: (updatedCategory) => {
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat._id === updatedCategory._id ? updatedCategory : cat
      ),
    }));
    set((state) => ({ refreshTrigger: state.refreshTrigger + 1 }));
  },

  removeCategory: (id) => {
    set((state) => ({
      categories: state.categories.filter((category) => category._id !== id),
    }));
    set((state) => ({ refreshTrigger: state.refreshTrigger + 1 }));
  },

}));
