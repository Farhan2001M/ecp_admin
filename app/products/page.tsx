// app/categories.tsx
"use client";
import React, { useEffect } from "react";
import Layout from "../components/Layout";
import CreateProduct from "../components/NewProduct";
import ProductsTable from "../components/ProductsTable";
import { useProductStore } from "../stores/useProductStore";

const Categories: React.FC = () => {
  const { fetchProducts, refreshTrigger } = useProductStore();

  useEffect(() => {
    fetchProducts(); // ✅ Fetch when refreshTrigger changes
  }, [fetchProducts, refreshTrigger]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-center">Products</h1>
      <div className="flex justify-end ">
        <CreateProduct />
      </div>
      <ProductsTable />
    </Layout>
  );
};

export default Categories;
