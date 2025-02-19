// components/ProductTable.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Product } from "../types/interfaces";
import EditProduct from "./EditProduct";
import DeleteProduct from "./DeleteProduct";

const ProductTable: React.FC = () => {
  const { products, fetchProducts } = useProductStore();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="mt-8 flow-root overflow-hidden">
      {editingProduct && <EditProduct product={editingProduct} onClose={() => setEditingProduct(null)} />}
      {deletingProduct && <DeleteProduct product={deletingProduct} onClose={() => setDeletingProduct(null)} />}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-3 text-sm font-semibold text-gray-900">Name</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Brand</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Category</th> 
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Price</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Stock</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">In Stock</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Rating</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Dimensions</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Images</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Videos</th>
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
                  <td className="px-3 py-4 text-sm text-gray-500">{product.brand}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {typeof product.categoryID === "object" ? product.categoryID.name : "Unknown"}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">${product.price.toFixed(2)}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">{product.totalStock}</td>
                  <td className="px-3 py-4 text-sm">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {product.inStock ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">{product.ratings}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">{product.dimensions}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">{product.images.length}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">{product.videos.length}</td>
                  <td className="px-3 py-4 text-sm flex space-x-2">
                    <button onClick={() => setEditingProduct(product)} className="text-indigo-600 hover:text-indigo-900">
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button onClick={() => setDeletingProduct(product)} className="text-red-600 hover:text-red-900">
                      <MdDelete className="w-5 h-5" />
                    </button>
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
