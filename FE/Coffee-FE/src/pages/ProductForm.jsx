import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Package, ArrowLeft, Save, Loader2 } from "lucide-react";

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
    categoryId: "",
    name: "",
    description: "",
    imageUrl: "",
    hasMultipleSizes: false,
    isActive: true,
    variants: [{ name: "Standard", price: "" }],
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
    const [imageError, setImageError] = useState(false);

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

                    // Fetch variants for this product
                    api(`${API_BASE}/product-variants?productId=${id}`).then(varJson => {
                        console.log("Fetched variants:", varJson);
                        let vars = [];
                        if (varJson.success && varJson.data.length > 0) {
                            vars = varJson.data.map(v => ({ name: v.name, price: v.price }));
                        } else {
                            // fallback
                            vars = p.hasMultipleSizes
                                ? [{ name: "M", price: "" }, { name: "L", price: "" }, { name: "XL", price: "" }]
                                : [{ name: "Standard", price: "" }];
                        }

                        setForm({
                            categoryId: p.categoryId || "",
                            name: p.name || "",
                            description: p.description || "",
                            imageUrl: p.imageUrl || "",
                            hasMultipleSizes: p.hasMultipleSizes || false,
                            isActive: p.isActive ?? true,
                            variants: vars,
                        });
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
            // Clean up variants format before sending
            const formattedVariants = form.variants
                .filter(v => v.price !== "" && v.price !== null)
                .map(v => ({
                    name: v.name,
                    price: parseFloat(v.price) || 0,
                    isActive: true
                }));

            const body = {
                ...form,
                categoryId: parseInt(form.categoryId),
                variants: formattedVariants
            };

            console.log("Submitting Product with variants:", body.variants);

            const json = isEdit
                ? await api(`${API_BASE}/products/${id}`, { method: "PUT", body: JSON.stringify(body) })
                : await api(`${API_BASE}/products`, { method: "POST", body: JSON.stringify(body) });

            console.log("Product save response:", json);

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
                            onChange={(e) => {
                                setForm({ ...form, imageUrl: e.target.value });
                                setImageError(false);
                            }}
                            placeholder="https://example.com/image.jpg"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        {form.imageUrl && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-400 mb-1">Preview:</p>
                                {!imageError ? (
                                    <img
                                        src={form.imageUrl}
                                        alt="preview"
                                        className="w-32 h-32 object-cover rounded-lg border border-gray-200 bg-white"
                                        onError={() => setImageError(true)}
                                    />
                                ) : (
                                    <div className="w-32 h-32 bg-red-50 text-red-500 border border-red-200 rounded-lg flex items-center justify-center text-xs text-center p-2 font-medium">
                                        Invalid Image URL
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Price / Variants */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex gap-8 mb-4">
                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none font-medium">
                                <input
                                    type="checkbox"
                                    checked={form.hasMultipleSizes}
                                    onChange={(e) => {
                                        const multi = e.target.checked;
                                        setForm({
                                            ...form,
                                            hasMultipleSizes: multi,
                                            variants: multi
                                                ? [{ name: "M", price: "" }, { name: "L", price: "" }, { name: "XL", price: "" }]
                                                : [{ name: "Standard", price: "" }]
                                        });
                                    }}
                                    className="accent-amber-600 w-4 h-4 rounded"
                                />
                                Enable multiple sizes (M, L, XL)
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none font-medium">
                                <input
                                    type="checkbox"
                                    checked={form.isActive}
                                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                    className="accent-amber-600 w-4 h-4 rounded"
                                />
                                Active (selling)
                            </label>
                        </div>

                        {!form.hasMultipleSizes ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Price (VND) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={form.variants[0]?.price || ""}
                                    onChange={(e) => {
                                        const newVars = [...form.variants];
                                        if (!newVars[0]) newVars[0] = { name: "Standard", price: "" };
                                        newVars[0].price = e.target.value;
                                        setForm({ ...form, variants: newVars });
                                    }}
                                    placeholder="e.g. 35000"
                                    className="w-full sm:w-1/2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                                />
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Size Prices (VND)</label>
                                {["M", "L", "XL"].map((sizeName, idx) => {
                                    const variant = form.variants.find(v => v.name === sizeName) || { name: sizeName, price: "" };
                                    return (
                                        <div key={sizeName} className="flex items-center gap-4">
                                            <span className="w-12 font-semibold text-gray-600">Size {sizeName}</span>
                                            <input
                                                type="number"
                                                min="0"
                                                value={variant.price}
                                                onChange={(e) => {
                                                    const newVars = [...form.variants];
                                                    const matchingIdx = newVars.findIndex(v => v.name === sizeName);
                                                    if (matchingIdx >= 0) {
                                                        newVars[matchingIdx].price = e.target.value;
                                                    } else {
                                                        newVars.push({ name: sizeName, price: e.target.value });
                                                    }
                                                    setForm({ ...form, variants: newVars });
                                                }}
                                                placeholder={`Price for size ${sizeName}...`}
                                                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
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
