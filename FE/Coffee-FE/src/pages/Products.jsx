import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Plus, Edit, Trash2, Search, ToggleLeft, ToggleRight, Loader2, AlertCircle } from "lucide-react";

const API_BASE = "http://localhost:8080/api/products";

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

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const json = await api(API_BASE);
      if (json.success) setProducts(json.data.content);
      else setError(json.message || "Cannot load products.");
    } catch {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.categoryName || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleActive = async (product) => {
    try {
      const json = await api(`${API_BASE}/${product.id}/toggle-active`, { method: "PUT" });
      if (json.success)
        setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, isActive: !p.isActive } : p)));
      else alert("Toggle failed: " + json.message);
    } catch (err) {
      console.error("Toggle error", err);
      alert("Failed to connect to server when toggling");
    }
  };

  const handleDelete = async (id) => {
    try {
      const json = await api(`${API_BASE}/${id}`, { method: "DELETE" });
      if (json.success) setProducts((prev) => prev.filter((p) => p.id !== id));
      else alert("Delete failed: " + json.message);
    } catch {
      alert("Cannot connect to server.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="text-amber-600" size={32} />
            Products
          </h1>
          <p className="text-gray-600 mt-1">Manage your coffee shop products</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/products/new")}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-48 text-gray-500 gap-3">
          <Loader2 className="animate-spin" size={24} />
          Loading products...
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center gap-3 text-red-600 bg-red-50 border border-red-200 p-4 rounded-xl">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-12">No products found.</div>
          ) : (
            filtered.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border ${product.isActive ? "border-gray-200" : "border-gray-100 opacity-60"
                  }`}
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div className="w-full h-48 bg-amber-50 flex items-center justify-center">
                    <Package size={48} className="text-amber-200" />
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
                      <p className="text-sm text-amber-600">{product.categoryName || "Uncategorized"}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${product.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {product.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                  )}

                  <div className="flex items-center gap-1 mb-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${product.hasMultipleSizes ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-500"}`}>
                      {product.hasMultipleSizes ? "Multiple sizes" : "One size"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {/* Edit → navigate to form page */}
                    <button
                      onClick={() => navigate(`/dashboard/products/${product.id}/edit`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      <Edit size={15} /> Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(product)}
                      className="flex items-center justify-center px-3 py-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                      title={product.isActive ? "Deactivate" : "Activate"}
                    >
                      {product.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </button>
                    <button
                      onClick={() => setDeletingId(product.id)}
                      className="flex items-center justify-center px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Delete Confirm */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
