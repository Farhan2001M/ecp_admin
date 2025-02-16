// components/DeleteProduct.tsx
"use client";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import { Product } from "../types/interfaces";

interface DeleteProductProps {
  product: Product;
  onClose: () => void;
}

export default function DeleteProduct({ product, onClose }: DeleteProductProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isFinalConfirmOpen, setIsFinalConfirmOpen] = useState(false);

  // Reset all states when closing
  const handleClose = () => {
    setIsOpen(false);
    setIsFinalConfirmOpen(false);
    onClose();
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:5000/api/products/${product._id}`, {
        method: "DELETE",
      });
      useProductStore.getState().removeProduct(product._id);
      handleClose();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <>
      {/* Initial Confirmation Modal */}
      <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <Dialog.Title className="text-lg font-semibold mb-2">
              Delete Product
            </Dialog.Title>
            <p className="mb-4">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsFinalConfirmOpen(true);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Final Confirmation Modal */}
      <Dialog open={isFinalConfirmOpen} onClose={handleClose} className="relative z-[60]">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full">
            <Dialog.Title className="text-lg font-semibold mb-2 text-red-600">
              ⚠️ Permanent Deletion
            </Dialog.Title>
            <p className="mb-4">
              This action cannot be undone. This will permanently delete the <strong>{product.name}</strong> product and all associated data such as its <strong>Images</strong>, <strong>Videos</strong>, and <strong>Ratings</strong>.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}