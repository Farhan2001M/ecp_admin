// components/ProductTable.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Product } from "../types/interfaces";
import EditProduct from "./EditProduct";
import DeleteProduct from "./DeleteProduct";
import ConfirmationModal from "./ProductStatusToggleModal"; // Import the new component
import { Switch } from '@headlessui/react'

const ProductTable: React.FC = () => {
  const { products, fetchProducts , toggleProductStatus } = useProductStore();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const handleToggleStatus = async () => {
    if (selectedProductId) {
      await toggleProductStatus(selectedProductId);
      setIsConfirmationModalOpen(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="mt-8 flow-root overflow-hidden">

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleToggleStatus}
        message="The status will be reflected on the website immediately. Are you sure you want to proceed?"
      />
      
      {editingProduct && <EditProduct product={editingProduct} onClose={() => setEditingProduct(null)} />}
      {deletingProduct && <DeleteProduct product={deletingProduct} onClose={() => setDeletingProduct(null)} />}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-3 text-sm font-semibold text-gray-900">Name</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Tagline</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Brand</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Category</th> 
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Price</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Stock</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Rating</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Status</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Dimensions</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Images</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Video</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="border-b bg-white">
                  <td className="py-4 px-3 text-sm text-gray-900 flex items-center space-x-3">
                    {product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-md border border-black"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-500">No Img</span>
                      </div>
                    )}
                    <span>{product.name}</span>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">{product.tagline}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">{product.brand}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {typeof product.categoryID === "object" ? product.categoryID.name : "Unknown"}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">${product.price.toFixed(2)}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">{product.totalStock}</td>
                  
                  <td className="px-3 py-4 text-sm text-gray-500">{product.ratings}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    <Switch
                      checked={product.status} // Use boolean status
                      onChange={() => {
                        setSelectedProductId(product._id);
                        setIsConfirmationModalOpen(true);
                      }}
                      className={`${
                        product.status ? "bg-green-500" : "bg-gray-300"
                      } relative inline-flex h-6 w-11 items-center rounded-full`}
                    >
                      <span className="sr-only">Toggle status</span>
                      <span
                        className={`${
                          product.status ? "translate-x-6" : "translate-x-1"
                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                      />
                    </Switch>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">{product.dimensions}</td>
                  <td className="px-3 py-4 text-sm">
                    <div className="flex items-center justify-center h-full">
                      {product.images.length > 0 ? (
                        <span>{product.images.length}</span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm">
                    <div className="flex items-center justify-center h-full">
                      {product.video ? (
                        <a
                          href={product.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm">
                    <div className="flex space-x-2 items-center h-full">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center" >
                        <FaEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setDeletingProduct(product)}
                        className="text-red-600 hover:text-red-900 flex items-center" >
                        <MdDelete className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-4 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
