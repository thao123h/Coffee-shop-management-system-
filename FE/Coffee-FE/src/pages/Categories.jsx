import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Tag, Plus, Edit, ToggleRight, ToggleLeft, Loader2, Search, AlertCircle } from "lucide-react";
import { toast } from "sonner";
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
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pageIndex = currentPage - 1;
      const res = await api(`${API_BASE}/categories?page=${pageIndex}&size=${pageSize}&keyword=${search}`);
      if (res.success) {
        setCategories(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      } else {
        setError(res.message || "Không thể tải danh sách danh mục.");
      }
    } catch (error) {
      setError("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleToggleActive = async (category) => {
    try {
      const res = await api(`${API_BASE}/categories/${category.id}/toggle-active`, {
        method: "PATCH"
      });
      if (res.success) {
        setCategories((prev) => prev.map((c) => (c.id === category.id ? res.data : c)));
        toast.success(`Danh mục ${category.name} đã được ${res.data.isActive ? 'kích hoạt' : 'tạm dừng'}`);
      } else {
        toast.error(res.message || "Thao tác thất bại");
      }
    } catch {
      toast.error("Lỗi kết nối");
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 font-display">
            <Tag className="text-amber-600" size={32} />
            Danh Mục
          </h1>
          <p className="text-gray-600 mt-1 font-medium">Phân loại các sản phẩm trong thực đơn của quán</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/categories/new")}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg hover:shadow-xl active:scale-95 font-bold text-sm tracking-wide"
        >
          <Plus size={20} />
          Thêm danh mục
        </button>
      </div>

      {/* Filters & PageSize */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên danh mục..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none shadow-sm shadow-amber-50 font-medium"
          />
        </div>
        <select
          value={pageSize}
          onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
          className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white shadow-sm font-bold"
        >
          {[6, 12, 24, 48].map(s => (
            <option key={s} value={s}>{s} / trang</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
          <Loader2 className="animate-spin text-amber-600" size={48} />
          <p className="font-bold italic">Đang tải danh sách danh mục...</p>
        </div>
      ) : error ? (
        <div className="p-10 text-center text-red-600 font-bold bg-red-50 rounded-3xl border border-red-100 flex items-center justify-center gap-3 shadow-sm">
          <AlertCircle size={24} /> {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {categories.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 py-20 italic bg-white rounded-3xl border-2 border-dashed border-gray-100 shadow-inner">
                <Tag size={64} className="mx-auto mb-4 opacity-10" />
                Không có danh mục nào phù hợp với tìm kiếm.
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className={`bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 relative group overflow-hidden ${
                    !category.isActive ? 'opacity-70 bg-gray-50/50' : ''
                  }`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-10 -mt-10 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
                          <Tag className="text-amber-700" size={28} />
                        </div>
                        <div>
                          <h3 className="font-display font-black text-xl text-gray-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
                            {category.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black bg-white text-gray-400 px-2 py-0.5 rounded-lg border border-gray-100 uppercase tracking-widest shadow-sm">
                              {category.code}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] shadow-sm ${
                              category.isActive ? "bg-green-500 text-white" : "bg-gray-400 text-white"
                            }`}>
                              {category.isActive ? "Hoạt động" : "Tạm dừng"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-500 text-sm mb-8 line-clamp-2 min-h-[40px] font-medium leading-relaxed italic">
                      {category.description || "Danh mục này chưa được thêm mô tả chi tiết."}
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/dashboard/categories/${category.id}/edit`)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2.5 rounded-2xl hover:bg-blue-600 hover:text-white transition-all text-xs font-black uppercase tracking-widest shadow-sm active:scale-95"
                      >
                        <Edit size={16} /> Sửa
                      </button>
                      <button
                        onClick={() => handleToggleActive(category)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl transition-all text-xs font-black uppercase tracking-widest shadow-sm active:scale-95 ${
                          category.isActive 
                            ? "bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white" 
                            : "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white"
                        }`}
                        title={category.isActive ? "Ngừng hoạt động" : "Kích hoạt danh mục"}
                      >
                        {category.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                        <span className="font-black uppercase tracking-widest">{category.isActive ? "Khóa" : "Mở"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
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
    </div>
  );
}
