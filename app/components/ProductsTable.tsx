// components/ProductTable.tsx
"use client";
import React, { useState } from "react";
import { useProductStore } from "../stores/useProductStore"; // Assuming you have a store for products
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Product } from "../types/interfaces";
import EditProduct from "./EditProduct";
import DeleteProduct from "./DeleteProduct";

const ProductTable: React.FC = () => {
  const { products } = useProductStore();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  return (
    <div className="mt-8 flow-root overflow-hidden">
      {editingProduct && (
        <EditProduct 
          product={editingProduct} 
          onClose={() => setEditingProduct(null)}
        />
      )}
      {deletingProduct && (
        <DeleteProduct 
          product={deletingProduct} 
          onClose={() => setDeletingProduct(null)}
        />
      )}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-3 text-sm font-semibold text-gray-900">Name</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Brand</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Category</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Price</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">SKU</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Availability</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Ratings</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Dimensions</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b bg-white">
                <td className="py-4 px-3 text-sm text-gray-900">{product.name}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{product.brand}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{product.category}</td>
                <td className="px-3 py-4 text-sm text-gray-500">${product.price.toFixed(2)}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{product.sku}</td>
                <td className="px-3 py-4 text-sm">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">{product.ratings?.toFixed(1) || "N/A"}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{product.dimensions || "N/A"}</td>
                <td className="px-3 py-4 text-sm flex space-x-4">
                  <button 
                    onClick={() => setEditingProduct(product)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <FaEdit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setDeletingProduct(product)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <MdDelete className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
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