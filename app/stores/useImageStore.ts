// stores/useImageStore.ts
import { create } from "zustand";

interface ImageStore {
  urls: string[]; // Array of image URLs
  originalUrls: string[]; // Original order of image URLs
  fetchImages: () => Promise<void>;
  addImage: (url: string) => void; // Add to local state only
  updateImageOrder: (urls: string[]) => Promise<void>; // Update database
  removeImage: (index: number) => void; // Remove from local state
  hasChanges: () => boolean; // Check if changes have been made
}

export const useImageStore = create<ImageStore>((set, get) => ({
  urls: [],
  originalUrls: [],

  // Fetch images from the backend (called once)
  fetchImages: async () => {
    try {
      const res = await fetch("http://localhost:5000/api/images");
      const data = await res.json();
      set({ urls: data, originalUrls: data }); // Initialize both urls and originalUrls
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  },

  // Add a new image to the local state only
  addImage: (url: string) => {
    set((state) => ({
      urls: [...state.urls, url],
    }));
  },

  // Update the order of images in the database
  updateImageOrder: async (urls: string[]) => {
    try {
      const response = await fetch("http://localhost:5000/api/images/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });

      if (!response.ok) {
        throw new Error("Failed to update image order");
      }

      const data = await response.json();
      set({ urls: data.urls, originalUrls: data.urls }); // Update both urls and originalUrls
    } catch (error) {
      console.error("Failed to update image order:", error);
      throw error;
    }
  },

  // Remove an image from the local state
  removeImage: (index: number) => {
    set((state) => ({
      urls: state.urls.filter((_, i) => i !== index),
    }));
  },

  // Check if changes have been made
  hasChanges: () => {
    const { urls, originalUrls } = get();
    return JSON.stringify(urls) !== JSON.stringify(originalUrls);
  },
}));