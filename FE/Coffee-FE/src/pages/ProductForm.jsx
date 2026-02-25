import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Package, ArrowLeft, Save, Loader2 } from "lucide-react";

const API_BASE = "http://localhost:8080";

async function api(url, options = {}) {
    const token = localStorage.getItem("token");
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...options,
    });
    return res.json();
}

const EMPTY_FORM = {
    categoryId: "",
    name: "",
    description: "",
    imageUrl: "",
    hasMultipleSizes: false,
    isActive: true,
};

export default function ProductForm() {
    const { id } = useParams(); // nếu có id → edit mode
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [form, setForm] = useState(EMPTY_FORM);
    const [categories, setCategories] = useState([]);
    const [saving, setSaving] = useState(false);
    const [loadingData, setLoadingData] = useState(isEdit);
    const [error, setError] = useState(null);

    // Load categories
    useEffect(() => {
        api(`${API_BASE}/categories`).then((json) => {
            if (json.success) setCategories(json.data);
        });
    }, []);

    // Load product if edit mode
    useEffect(() => {
        if (!isEdit) return;
        setLoadingData(true);
        api(`${API_BASE}/products/${id}`)
            .then((json) => {
                if (json.success) {
                    const p = json.data;
                    setForm({
                        categoryId: p.categoryId || "",
                        name: p.name || "",
                        description: p.description || "",
                        imageUrl: p.imageUrl || "",
                        hasMultipleSizes: p.hasMultipleSizes || false,
                        isActive: p.isActive ?? true,
                    });
                } else {
                    setError("Product not found.");
                }
            })
            .catch(() => setError("Cannot connect to server."))
            .finally(() => setLoadingData(false));
    }, [id, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const body = { ...form, categoryId: parseInt(form.categoryId) };
            const json = isEdit
                ? await api(`${API_BASE}/products/${id}`, { method: "PUT", body: JSON.stringify(body) })
                : await api(`${API_BASE}/products`, { method: "POST", body: JSON.stringify(body) });

            if (json.success) {
                navigate("/dashboard/products");
            } else {
                setError(json.message || "An error occurred.");
            }
        } catch {
            setError("Cannot connect to server.");
        } finally {
            setSaving(false);
        }
    };

    if (loadingData) {
        return (
            <div className="flex items-center justify-center h-64 gap-3 text-gray-500">
                <Loader2 className="animate-spin" size={24} />
                Loading product data...
            </div>
        );
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate("/dashboard/products")}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-4 text-sm"
                >
                    <ArrowLeft size={18} />
                    Back to Products
                </button>

                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Package className="text-amber-600" size={32} />
                    {isEdit ? "Edit Product" : "Add New Product"}
                </h1>
                <p className="text-gray-500 mt-1">
                    {isEdit ? "Update the product information below." : "Fill in the details to add a new product."}
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                    {error}
                </div>
            )}

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100">
                    <h2 className="font-semibold text-amber-800">Product Information</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={form.categoryId}
                            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                        >
                            <option value="">-- Select category --</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g. Cà phê sữa đá"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                        <textarea
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Short description of the product..."
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                        />
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
                        <input
                            type="text"
                            value={form.imageUrl}
                            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        {form.imageUrl && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-400 mb-1">Preview:</p>
                                <img
                                    src={form.imageUrl}
                                    alt="preview"
                                    className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                                    onError={(e) => { e.target.style.display = "none"; }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Options */}
                    <div className="flex gap-8 pt-1">
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={form.hasMultipleSizes}
                                onChange={(e) => setForm({ ...form, hasMultipleSizes: e.target.checked })}
                                className="accent-amber-600 w-4 h-4 rounded"
                            />
                            Has multiple sizes
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={form.isActive}
                                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                className="accent-amber-600 w-4 h-4 rounded"
                            />
                            Active (selling)
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard/products")}
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60 shadow-md"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {isEdit ? "Save Changes" : "Create Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
