import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Plus, Edit, Search, ToggleLeft, ToggleRight, Loader2, AlertCircle } from "lucide-react";
import { Pagination } from "../components/Pagination";
import { toast } from "sonner";

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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12); // Grid layout, so maybe multiples of 3 or 4
  const [totalPages, setTotalPages] = useState(0);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pageIndex = currentPage - 1;
      const json = await api(`${API_BASE}?page=${pageIndex}&size=${pageSize}&keyword=${search}`);
      if (json.success) {
        setProducts(json.data.content || []);
        setTotalPages(json.data.totalPages || 0);
      } else {
        setError(json.message || "Không thể tải danh sách sản phẩm.");
      }
    } catch {
      setError("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, search]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleToggleActive = async (product) => {
    try {
      const json = await api(`${API_BASE}/${product.id}/toggle-active`, { method: "PUT" });
      if (json.success) {
        setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, isActive: !p.isActive } : p)));
        toast.success(`${product.name} đã được ${!product.isActive ? 'Kích hoạt' : 'Tạm dừng'}`);
      } else {
        toast.error("Thao tác thất bại: " + json.message);
      }
    } catch (err) {
      toast.error("Lỗi kết nối máy chủ");
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 font-display">
            <Package className="text-amber-600" size={32} />
            Sản Phẩm
          </h1>
          <p className="text-gray-600 mt-1 font-medium">Quản lý thực đơn và các món đồ uống của quán</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/products/new")}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg hover:shadow-xl active:scale-95 font-bold text-sm tracking-wide"
        >
          <Plus size={20} />
          Thêm sản phẩm
        </button>
      </div>

      {/* Filters & PageSize */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm theo tên hoặc danh mục..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none shadow-sm shadow-amber-50"
          />
        </div>
        <select
          value={pageSize}
          onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
          className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white shadow-sm font-medium"
        >
          {[8, 12, 24, 48].map(s => (
            <option key={s} value={s}>{s} / trang</option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-amber-600" size={48} />
          <p className="text-gray-500 font-medium italic">Đang tải danh sách sản phẩm...</p>
        </div>
      ) : error ? (
        <div className="p-10 text-center text-red-600 font-bold bg-red-50 rounded-2xl border border-red-100 flex items-center justify-center gap-3">
          <AlertCircle size={24} /> {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            {products.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 py-20 italic bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <Package size={64} className="mx-auto mb-4 opacity-20" />
                Không tìm thấy sản phẩm nào phù hợp.
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className={`bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group ${
                    product.isActive ? "" : "opacity-75 grayscale-[0.2]"
                  }`}
                >
                  {/* Image Section */}
                  <div className="relative h-56 w-full overflow-hidden bg-gray-50">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/600x400/fffbeb/b45309?text=Coffee";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 gap-3">
                         <div className="p-4 bg-white rounded-2xl shadow-sm">
                           <Package size={40} className="text-amber-200" />
                         </div>
                         <span className="text-[10px] text-amber-300 font-black uppercase tracking-[0.2em]">Chưa có hình</span>
                      </div>
                    )}
                    
                    {/* Status Badge on Image */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md ${
                        product.isActive 
                          ? "bg-green-500/90 text-white" 
                          : "bg-red-500/90 text-white"
                      }`}>
                        {product.isActive ? "Đang bán" : "Ngừng bán"}
                      </span>
                    </div>

                    {!product.isActive && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                        <span className="bg-white/95 text-gray-900 px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl border border-gray-100">Dừng Kinh Doanh</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1.5">{product.categoryName || "Chưa phân loại"}</p>
                      <h3 className="font-display font-bold text-xl text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-1">{product.name}</h3>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/dashboard/products/${product.id}/edit`)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-3 py-2.5 rounded-2xl hover:bg-blue-600 hover:text-white transition-all text-xs font-bold uppercase tracking-widest shadow-sm active:scale-95"
                      >
                        <Edit size={16} /> Sửa
                      </button>
                      <button
                        onClick={() => handleToggleActive(product)}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl transition-all shadow-sm active:scale-95 ${
                          product.isActive 
                            ? "bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white" 
                            : "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white"
                        }`}
                        title={product.isActive ? "Ngừng kinh doanh" : "Kích hoạt món"}
                      >
                        {product.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                        <span className="text-xs font-bold uppercase tracking-widest">{product.isActive ? "Khóa" : "Mở"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mb-8">
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
