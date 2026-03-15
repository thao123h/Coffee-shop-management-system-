import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tag, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Pagination } from "../components/Pagination";

const API_BASE = "http://localhost:8080/api";

async function api(url, options = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: token } : {}),
    },
    ...options,
  });
  return res.json();
}

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api(`${API_BASE}/categories`);
      if (res.success) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await api(`${API_BASE}/categories/${id}`, { method: "DELETE" });
      if (res.success) {
        setCategories(categories.filter((c) => c.id !== id));
      } else {
        alert(res.message || "Failed to delete");
      }
    } catch (error) {
      console.error("Delete error", error);
      alert("Error deleting category");
    }
  };

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = categories.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-12">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
        <span className="ml-3 text-gray-600">Loading categories...</span>
      </div>
    );
  }

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
        <button
          onClick={() => navigate("/dashboard/categories/new")}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg hover:shadow-xl"
        >
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
                    Code: {category.code} {category.isActive ? '' : '(Inactive)'}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-2 min-h-[48px]">
              {category.description || 'No description provided.'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/dashboard/categories/${category.id}/edit`)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            No categories found. Click "Add Category" to create one.
          </div>
        )}
      </div>

      {categories.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
