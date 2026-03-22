import React, { useState, useEffect, useCallback } from "react";
import { Coffee, Plus, Edit, Search, ToggleLeft, ToggleRight, Loader2, AlertCircle } from "lucide-react";
import { Pagination } from "../components/Pagination";
import { toast } from "sonner";

const API_BASE = "http://localhost:8080/api/toppings";

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

function ToppingModal({ topping, onClose, onSaved }) {
    const isEdit = !!topping;
    const [form, setForm] = useState({
        name: topping?.name || "",
        price: topping?.price || "",
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
                onSaved();
                onClose();
                toast.success(`Topping đã được ${isEdit ? "cập nhật" : "tạo mới"} thành công`);
            } else setError(json.message || "Đã xảy ra lỗi.");
        } catch {
            setError("Không thể kết nối đến máy chủ.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-5 border-b flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">{isEdit ? "Sửa Topping" : "Thêm Topping"}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-900 font-bold text-xl transition-colors">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2 animate-shake"><AlertCircle size={16} /> {error}</div>}
                    <div>
                        <label className="block text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1.5 ml-1">Tên Topping</label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full border border-gray-200 rounded-2xl px-5 py-3 focus:ring-4 focus:ring-amber-400/20 focus:border-amber-400 outline-none transition-all shadow-sm font-medium"
                            placeholder="VD: Trân châu trắng"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1.5 ml-1">Giá bán (VNĐ)</label>
                        <input
                            type="number"
                            required
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                            className="w-full border border-gray-200 rounded-2xl px-5 py-3 focus:ring-4 focus:ring-amber-400/20 focus:border-amber-400 outline-none transition-all shadow-sm font-medium"
                            placeholder="VD: 5000"
                        />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-3 text-gray-500 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all uppercase font-black text-[10px] tracking-widest active:scale-95 shadow-sm">Hủy bỏ</button>
                        <button type="submit" disabled={saving} className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl hover:from-amber-700 hover:to-amber-800 transition-all uppercase font-black text-[10px] tracking-widest flex justify-center items-center gap-2 shadow-lg active:scale-95 disabled:opacity-50">
                            {saving && <Loader2 size={16} className="animate-spin" />}
                            {isEdit ? "Cập nhật" : "Tạo mới"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function Toppings() {
    const [toppings, setToppings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingTopping, setEditingTopping] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const loadToppings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const pageIndex = currentPage - 1;
            const json = await api(`${API_BASE}?page=${pageIndex}&size=${pageSize}&keyword=${search}`);
            if (json.success) {
                setToppings(json.data.content || []);
                setTotalPages(json.data.totalPages || 0);
            } else {
                setError(json.message || "Không thể tải danh sách topping.");
            }
        } catch {
            setError("Không thể kết nối đến máy chủ.");
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, search]);

    useEffect(() => { loadToppings(); }, [loadToppings]);

    const handleSaved = () => {
        setCurrentPage(1);
        loadToppings();
    };

    const handleToggleActive = async (topping) => {
        try {
            const json = await api(`${API_BASE}/${topping.id}/toggle-active`, { method: "PATCH" });
            if (json.success) {
                setToppings((prev) => 
                    prev.map((t) => (t.id === topping.id ? json.data : t))
                );
                toast.success(`Topping ${topping.name} đã được ${json.data.isActive ? 'kích hoạt' : 'tạm ngưng'}`);
            } else {
                toast.error(json.message || "Thao tác thất bại");
            }
        } catch {
            toast.error("Lỗi kết nối máy chủ");
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 font-display">
                        <Coffee className="text-amber-600" size={32} /> Quản Lý Toppings
                    </h1>
                    <p className="text-gray-600 mt-1 font-medium">Danh sách các món thêm để tối ưu doanh thu</p>
                </div>
                <button 
                  onClick={() => { setEditingTopping(null); setShowModal(true); }} 
                  className="bg-gradient-to-br from-amber-600 to-amber-800 text-white px-8 py-3.5 rounded-2xl hover:scale-105 active:scale-95 shadow-xl shadow-amber-200 transition-all font-black text-xs uppercase tracking-widest flex items-center gap-2"
                >
                    <Plus size={20} /> Thêm Topping
                </button>
            </div>

            {/* Filters & PageSize */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm topping theo tên..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-amber-400/10 focus:border-amber-400 outline-none shadow-sm shadow-amber-50 font-medium"
                    />
                </div>
                <select
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                    className="border border-gray-100 rounded-2xl px-6 py-3.5 text-xs font-black uppercase tracking-widest text-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-400/10 bg-white shadow-sm cursor-pointer hover:bg-amber-50/50 transition-colors"
                >
                    {[5, 10, 20, 50].map(s => (
                        <option key={s} value={s}>{s} / trang</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 animate-pulse">
                    <Loader2 className="animate-spin text-amber-600" size={56} />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Đang nạp dữ liệu...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-8 rounded-[2rem] flex items-center gap-4 border border-red-100 shadow-sm animate-in fade-in zoom-in-95 duration-300">
                    <AlertCircle size={32} /> 
                    <p className="font-black uppercase tracking-widest text-sm">{error}</p>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-50 overflow-hidden mb-8 transition-all duration-500 hover:shadow-amber-100/50">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-amber-50/50 border-b border-amber-100/50">
                                    <tr>
                                        <th className="text-left px-8 py-5 font-black text-amber-800 uppercase tracking-widest text-[10px]">Topping</th>
                                        <th className="text-left px-8 py-5 font-black text-amber-800 uppercase tracking-widest text-[10px]">Đơn giá</th>
                                        <th className="text-center px-8 py-5 font-black text-amber-800 uppercase tracking-widest text-[10px]">Trạng thái</th>
                                        <th className="text-center px-8 py-5 font-black text-amber-800 uppercase tracking-widest text-[10px]">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {toppings.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-16 text-center text-gray-300 font-bold italic text-base">
                                                <Coffee size={48} className="mx-auto mb-4 opacity-10" />
                                                Không có topping nào phù hợp.
                                            </td>
                                        </tr>
                                    ) : (
                                        toppings.map((t) => (
                                            <tr key={t.id} className={`hover:bg-amber-50/30 transition-all duration-300 group ${t.isActive ? "" : "opacity-60 bg-gray-50/50 italic scale-[0.99]"}`}>
                                                <td className="px-8 py-5 font-black text-gray-900 group-hover:text-amber-700 transition-colors">{t.name}</td>
                                                <td className="px-8 py-5">
                                                    <span className="font-mono font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl shadow-sm">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(t.price)}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <span className={`inline-flex items-center px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ring-1 ring-inset ${t.isActive ? "bg-green-500 text-white ring-green-600" : "bg-gray-400 text-white ring-gray-500"}`}>
                                                        {t.isActive ? "Sẵn sàng" : "Hết hàng"}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <button onClick={() => { setEditingTopping(t); setShowModal(true); }} className="p-2.5 text-blue-600 bg-blue-50/50 rounded-2xl hover:bg-blue-600 hover:text-white shadow-sm transition-all active:scale-90" title="Sửa thông tin"><Edit size={16} /></button>
                                                        <button onClick={() => handleToggleActive(t)} className={`p-2.5 rounded-2xl shadow-sm transition-all active:scale-90 ${t.isActive ? "bg-amber-50/50 text-amber-600 hover:bg-amber-600 hover:text-white" : "bg-green-50/50 text-green-600 hover:bg-green-600 hover:text-white"}`} title={t.isActive ? "Tạm ngưng" : "Kích hoạt"}>
                                                            {t.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center mb-10">
                            <Pagination 
                                currentPage={currentPage} 
                                totalPages={totalPages} 
                                onPageChange={setCurrentPage} 
                            />
                        </div>
                    )}
                </>
            )}

            {showModal && (
                <ToppingModal 
                    topping={editingTopping} 
                    onClose={() => { setShowModal(false); setEditingTopping(null); }} 
                    onSaved={handleSaved} 
                />
            )}
        </div>
    );
}
