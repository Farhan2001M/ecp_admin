// app/categories.tsx
"use client";
import React, { useEffect } from "react";
import Layout from "../components/Layout";
import CreateCategory from "../components/NewCategory";
import CategoryTable from "../components/CategoryTable";
import { useCategoryStore } from "../stores/useCategoryStore";

const Categories: React.FC = () => {
  const { fetchCategories, refreshTrigger } = useCategoryStore();

  useEffect(() => {
    fetchCategories(); // ✅ Fetch when refreshTrigger changes
  }, [fetchCategories, refreshTrigger]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-center">Categories</h1>
      <div className="flex justify-end ">
        <CreateCategory />
      </div>
      <CategoryTable />
    </Layout>
  );
};

export default Categories;
