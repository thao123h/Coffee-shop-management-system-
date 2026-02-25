import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Coffee, Plus, Edit, Trash2, Search,
    ToggleLeft, ToggleRight, Loader2, AlertCircle
} from "lucide-react";

const API_BASE = "http://localhost:8080/toppings";

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

// ─── Inline Form Modal (nhỏ gọn dùng trong trang) ─────────────────────────────
function ToppingModal({ topping, onClose, onSaved }) {
    const isEdit = Boolean(topping);
    const [form, setForm] = useState({
        name: topping?.name || "",
        price: topping?.price ?? "",
        isActive: topping?.isActive ?? true,
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            const body = { ...form, price: parseFloat(form.price) };
            const json = isEdit
                ? await api(`${API_BASE}/${topping.id}`, { method: "PUT", body: JSON.stringify(body) })
                : await api(API_BASE, { method: "POST", body: JSON.stringify(body) });
            if (json.success) {
                onSaved(json.data);
                onClose();
            } else {
                setError(json.message || "An error occurred.");
            }
        } catch {
            setError("Cannot connect to server.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-bold text-gray-900">
                        {isEdit ? "Edit Topping" : "Add Topping"}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg text-sm">{error}</div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g. Trân châu đen"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (VNĐ) <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            required
                            min="0"
                            step="500"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                            placeholder="e.g. 5000"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                    </div>

                    {/* Active */}
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer pt-1">
                        <input
                            type="checkbox"
                            checked={form.isActive}
                            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                            className="accent-amber-600 w-4 h-4"
                        />
                        Active (available in POS)
                    </label>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 text-sm">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving}
                            className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                            {saving && <Loader2 size={14} className="animate-spin" />}
                            {isEdit ? "Save Changes" : "Create Topping"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Toppings Page ──────────────────────────────────────────────────────────────
export default function Toppings() {
    const [toppings, setToppings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [editingTopping, setEditingTopping] = useState(null);

    // Delete confirm
    const [deletingId, setDeletingId] = useState(null);

    const loadToppings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const json = await api(API_BASE);
            if (json.success) setToppings(json.data);
            else setError(json.message || "Cannot load toppings.");
        } catch {
            setError("Cannot connect to server.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadToppings(); }, [loadToppings]);

    const filtered = toppings.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSaved = (savedTopping) => {
        setToppings((prev) => {
            const exists = prev.find((t) => t.id === savedTopping.id);
            return exists
                ? prev.map((t) => (t.id === savedTopping.id ? savedTopping : t))
                : [...prev, savedTopping];
        });
    };

    const handleToggleActive = async (topping) => {
        try {
            const json = await api(`${API_BASE}/${topping.id}/toggle-active`, { method: "PATCH" });
            if (json.success)
                setToppings((prev) => prev.map((t) => (t.id === topping.id ? json.data : t)));
        } catch { }
    };

    const handleDelete = async (id) => {
        try {
            const json = await api(`${API_BASE}/${id}`, { method: "DELETE" });
            if (json.success) setToppings((prev) => prev.filter((t) => t.id !== id));
            else alert("Delete failed: " + json.message);
        } catch {
            alert("Cannot connect to server.");
        } finally {
            setDeletingId(null);
        }
    };

    const formatPrice = (price) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Coffee className="text-amber-600" size={32} />
                        Toppings
                    </h1>
                    <p className="text-gray-600 mt-1">Manage add-on toppings for your drinks</p>
                </div>
                <button
                    onClick={() => { setEditingTopping(null); setShowModal(true); }}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg hover:shadow-xl"
                >
                    <Plus size={20} />
                    Add Topping
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search topping name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
            </div>

            {/* Summary bar */}
            {!loading && !error && (
                <div className="flex gap-4 mb-6">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3 flex items-center gap-3">
                        <span className="text-2xl font-bold text-amber-600">{toppings.length}</span>
                        <span className="text-sm text-gray-500">Total Toppings</span>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3 flex items-center gap-3">
                        <span className="text-2xl font-bold text-green-600">{toppings.filter((t) => t.isActive).length}</span>
                        <span className="text-sm text-gray-500">Active</span>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3 flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-400">{toppings.filter((t) => !t.isActive).length}</span>
                        <span className="text-sm text-gray-500">Inactive</span>
                    </div>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex justify-center items-center h-48 text-gray-500 gap-3">
                    <Loader2 className="animate-spin" size={24} /> Loading toppings...
                </div>
            )}

            {/* Error */}
            {error && !loading && (
                <div className="flex items-center gap-3 text-red-600 bg-red-50 border border-red-200 p-4 rounded-xl">
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            {/* Toppings Table */}
            {!loading && !error && (
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-amber-50 border-b border-amber-100">
                            <tr>
                                <th className="text-left px-6 py-4 font-semibold text-amber-800">Topping Name</th>
                                <th className="text-left px-6 py-4 font-semibold text-amber-800">Price</th>
                                <th className="text-center px-6 py-4 font-semibold text-amber-800">Status</th>
                                <th className="text-center px-6 py-4 font-semibold text-amber-800">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center text-gray-400 py-12">No toppings found.</td>
                                </tr>
                            ) : (
                                filtered.map((topping) => (
                                    <tr key={topping.id} className="hover:bg-gray-50 transition-colors">
                                        {/* Name */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                                                    <Coffee size={16} className="text-amber-600" />
                                                </div>
                                                <span className="font-medium text-gray-900">{topping.name}</span>
                                            </div>
                                        </td>

                                        {/* Price */}
                                        <td className="px-6 py-4 font-semibold text-amber-700">
                                            {formatPrice(topping.price)}
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${topping.isActive
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-500"
                                                    }`}
                                            >
                                                {topping.isActive ? "● Active" : "○ Inactive"}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => { setEditingTopping(topping); setShowModal(true); }}
                                                    className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium"
                                                >
                                                    <Edit size={13} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleToggleActive(topping)}
                                                    className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors text-xs font-medium"
                                                    title={topping.isActive ? "Deactivate" : "Activate"}
                                                >
                                                    {topping.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                                                    {topping.isActive ? "Deactivate" : "Activate"}
                                                </button>
                                                <button
                                                    onClick={() => setDeletingId(topping.id)}
                                                    className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors text-xs font-medium"
                                                >
                                                    <Trash2 size={13} /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create / Edit Modal */}
            {showModal && (
                <ToppingModal
                    topping={editingTopping}
                    onClose={() => { setShowModal(false); setEditingTopping(null); }}
                    onSaved={handleSaved}
                />
            )}

            {/* Delete Confirm */}
            {deletingId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={28} className="text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Topping?</h3>
                        <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeletingId(null)}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deletingId)}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
