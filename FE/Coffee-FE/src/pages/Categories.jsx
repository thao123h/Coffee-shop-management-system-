import React, { useState } from "react";
import { Tag, Plus, Edit, Trash2 } from "lucide-react";
import { Pagination } from "../components/Pagination";

export default function Categories() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const categories = [
    {
      id: 1,
      name: "Coffee",
      description: "Hot and cold coffee beverages",
      count: 12,
    },
    { id: 2, name: "Tea", description: "Various tea selections", count: 8 },
    { id: 3, name: "Pastries", description: "Fresh baked goods", count: 15 },
    {
      id: 4,
      name: "Sandwiches",
      description: "Light meals and snacks",
      count: 10,
    },
  ];
  
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = categories.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Tag className="text-amber-600" size={32} />
            Categories
          </h1>
          <p className="text-gray-600 mt-1">Manage product categories</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg hover:shadow-xl">
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Tag className="text-amber-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {category.count} products
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{category.description}</p>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                <Edit size={16} />
                Edit
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
