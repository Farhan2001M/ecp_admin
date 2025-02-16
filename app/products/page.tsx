// app/categories.tsx
"use client";
import React, { useEffect } from "react";
import Layout from "../components/Layout";
import CreateProduct from "../components/NewProduct";
// import ProductsTable from "../components/ProductsTable";
import { useCategoryStore } from "../stores/useCategoryStore";

const Categories: React.FC = () => {
  const { fetchCategories, refreshTrigger } = useCategoryStore();

  useEffect(() => {
    fetchCategories(); // ✅ Fetch when refreshTrigger changes
  }, [fetchCategories, refreshTrigger]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-center">Products</h1>
      <div className="flex justify-end ">
        <CreateProduct />
      </div>
      {/* <ProductsTable /> */}
    </Layout>
  );
};

export default Categories;
