"use client";
import React, { useState } from "react";
import { useCategoryStore } from "../stores/useCategoryStore";
import SaleModal from "./SaleModal";
import { Category } from "../types/interfaces";

const CategoryTable: React.FC = () => {
  const { categories, fetchCategories } = useCategoryStore();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSaleEdit = (category: Category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCategory(null); // Reset state
  };

  const getSaleStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  return (
    <div className="mt-8 flow-root overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-3 text-sm font-semibold text-gray-900">Name</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Sale Status</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Servings</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Servings Count</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Product Count</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Status</th>
              <th className="px-3 py-3 text-sm font-semibold text-gray-900">Highlighted</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="border-b bg-white">
                <td className="py-4 px-3 text-sm text-gray-900">{category.name}</td>
                <td className="px-3 py-4 text-sm cursor-pointer" onClick={() => handleSaleEdit(category)}>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSaleStatusBadge(category.saleStatus)}`}>
                    {category.saleStatus}
                  </span>
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">{category.servings.join(", ")}</td>
                <td className="px-3 py-4 text-sm text-gray-500 text-center pr-16">{category.servingsCount}</td>
                <td className="px-3 py-4 text-sm text-gray-500 text-center pr-14">{category.productCount}</td>
                <td className="px-3 py-4 text-sm">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${category.isactive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {category.isactive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-3 py-4 text-sm">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${category.highlighted ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>
                    {category.highlighted ? "Yes" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <SaleModal 
          open={isModalOpen} 
          onClose={handleCloseModal} 
          category={selectedCategory} 
          refreshCategories={fetchCategories} 
        />
      </div>
    </div>
  );
};

export default CategoryTable;











// "use client";
// import React, { useState } from "react";
// import { useCategoryStore } from "../stores/useCategoryStore";
// import { FaEdit } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
// import { Category } from "../types/interfaces";
// import EditCategory from "./EditCategory";
// import DeleteCategory from "./DeleteCategory";


// const CategoryTable: React.FC = () => {
//   const { categories } = useCategoryStore();
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

//   return (
//     <div className="mt-8 flow-root overflow-hidden">
//       {editingCategory && (
//         <EditCategory 
//           category={editingCategory} 
//           onClose={() => setEditingCategory(null)}
//         />
//       )}

//       {deletingCategory && (
//         <DeleteCategory 
//           category={deletingCategory} 
//           onClose={() => setDeletingCategory(null)}
//         />
//       )}

//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <table className="w-full text-left">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="py-3 px-3 text-sm font-semibold text-gray-900">Name</th>
//               <th className="px-3 py-3 text-sm font-semibold text-gray-900">Servings</th>
//               <th className="px-3 py-3 text-sm font-semibold text-gray-900">Servings Count</th>
//               <th className="px-3 py-3 text-sm font-semibold text-gray-900">Product Count</th>
//               <th className="px-3 py-3 text-sm font-semibold text-gray-900">Status</th>
//               <th className="px-3 py-3 text-sm font-semibold text-gray-900">Highlighted</th>
//               <th className="px-3 py-3 text-sm font-semibold text-gray-900">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {categories.map((category) => (
//               <tr key={category._id} className="border-b bg-white">
//                 <td className="py-4 px-3 text-sm text-gray-900">{category.name}</td>
//                 <td className="px-3 py-4 text-sm text-gray-500">{category.servings.join(", ")}</td>
//                 <td className="px-3 py-4 text-sm text-gray-500 text-center pr-16 ">{category.servingsCount}</td>
//                 <td className="px-3 py-4 text-sm text-gray-500 text-center pr-14 ">{category.productCount}</td>
//                 <td className="px-3 py-4 text-sm">
//                   <span className={`px-2 py-1 text-xs font-semibold rounded-full ${category.isactive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
//                     {category.isactive ? "Active" : "Inactive"}
//                   </span>
//                 </td>
//                 <td className="px-3 py-4 text-sm">
//                   <span className={`px-2 py-1 text-xs font-semibold rounded-full ${category.highlighted ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>
//                     {category.highlighted ? "Yes" : "No"}
//                   </span>
//                 </td>
//                 <td className="px-3 py-4 text-sm flex space-x-4">
//                   <button 
//                     onClick={() => setEditingCategory(category)}
//                     className="text-indigo-600 hover:text-indigo-900"
//                   >
//                     <FaEdit className="w-5 h-5" />
//                   </button>
//                   <button 
//                     onClick={() => setDeletingCategory(category)}
//                     className="text-red-600 hover:text-red-900"
//                   >
//                     <MdDelete className="w-5 h-5" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {categories.length === 0 && (
//               <tr>
//                 <td colSpan={8} className="text-center py-4 text-gray-500">
//                   No categories found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default CategoryTable;

