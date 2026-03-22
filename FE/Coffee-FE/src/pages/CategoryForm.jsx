import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tag, ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

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

const EMPTY_FORM = {
    name: "",
    code: "",
    description: "",
    displayOrder: 1,
    isActive: true,
};

export default function CategoryForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [loadingData, setLoadingData] = useState(isEdit);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isEdit) return;
        setLoadingData(true);
        api(`${API_BASE}/categories/${id}`)
            .then((json) => {
                if (json.success) {
                    const c = json.data;
                    setForm({
                        name: c.name || "",
                        code: c.code || "",
                        description: c.description || "",
                        displayOrder: c.displayOrder || 1,
                        isActive: c.isActive ?? true,
                    });
                } else {
                    setError("Category not found.");
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
            const body = { ...form, displayOrder: parseInt(form.displayOrder) || 1 };
            const json = isEdit
                ? await api(`${API_BASE}/categories/${id}`, { method: "PUT", body: JSON.stringify(body) })
                : await api(`${API_BASE}/categories`, { method: "POST", body: JSON.stringify(body) });

            if (json.success) {
                toast.success(isEdit ? "Category updated!" : "Category created!");
                navigate("/dashboard/categories");
            } else {
                setError(json.message || "An error occurred.");
                toast.error(json.message || "An error occurred.");
            }
        } catch {
            setError("Cannot connect to server.");
            toast.error("Cannot connect to server.");
        } finally {
            setSaving(false);
        }
    };

    if (loadingData) {
        return (
            <div className="flex items-center justify-center h-64 gap-3 text-gray-500">
                <Loader2 className="animate-spin" size={24} />
                Loading category data...
            </div>
        );
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate("/dashboard/categories")}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-4 text-sm"
                >
                    <ArrowLeft size={18} />
                    Back to Categories
                </button>

                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Tag className="text-amber-600" size={32} />
                    {isEdit ? "Edit Category" : "Add New Category"}
                </h1>
                <p className="text-gray-500 mt-1">
                    {isEdit ? "Update the category information below." : "Fill in the details to add a new category."}
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
                    <h2 className="font-semibold text-amber-800">Category Information</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Category Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g. Coffee"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                    </div>

                    {/* Code */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Category Code <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={form.code}
                            onChange={(e) => setForm({ ...form, code: e.target.value })}
                            placeholder="e.g. COFF123"
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
                            placeholder="Short description..."
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                        />
                    </div>

                    {/* Options */}
                    <div className="flex gap-8 pt-1">
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={form.isActive}
                                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                className="accent-amber-600 w-4 h-4 rounded"
                            />
                            Active
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard/categories")}
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
                            {isEdit ? "Save Changes" : "Create Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
