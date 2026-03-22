import React, { useState, useEffect, useCallback } from "react";
import {
  Ticket,
  Plus,
  Edit,
  Search,
  ToggleLeft,
  ToggleRight,
  Loader2,
  AlertCircle,
  Percent,
} from "lucide-react";
import {
  getAllVouchers,
  createVoucher,
  updateVoucher,
  toggleVoucherActive,
} from "../service/VoucherService";
import { Pagination } from "../components/Pagination";

// ─── Helpers ────────────────────────────────────────────────────────────────────
const toDatetimeLocal = (iso) => (iso ? iso.slice(0, 16) : "");

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value,
  );

const formatDate = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ─── Voucher Modal (Create / Edit) ──────────────────────────────────────────
function VoucherModal({ voucher, onClose, onSaved }) {
  const isEdit = Boolean(voucher);
  const [form, setForm] = useState({
    code: voucher?.code || "",
    discountValue: voucher?.discountValue ?? "",
    minOrderValue: voucher?.minOrderValue ?? "",
    usageLimit: voucher?.usageLimit ?? "",
    startDate: toDatetimeLocal(voucher?.startDate) || "",
    endDate: toDatetimeLocal(voucher?.endDate) || "",
    isActive: voucher?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const set = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const body = {
        code: form.code.trim().toUpperCase(),
        discountValue: parseFloat(form.discountValue),
        minOrderValue: parseFloat(form.minOrderValue),
        usageLimit: parseInt(form.usageLimit, 10),
        startDate: form.startDate,
        endDate: form.endDate,
        isActive: form.isActive,
      };

      const result = isEdit
        ? await updateVoucher(voucher.id, body)
        : await createVoucher(body);

      if (result.success) {
        onSaved(result.data);
        onClose();
      } else {
        setError(result.message || "Đã xảy ra lỗi.");
      }
    } catch {
      setError("Không thể kết nối đến máy chủ.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Ticket size={20} className="text-amber-600" />
            {isEdit ? "Chỉnh sửa voucher" : "Tạo voucher"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã voucher <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.code}
              onChange={(e) => set("code", e.target.value)}
              placeholder="VD: COFFEE20"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá trị giảm (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step="1000"
                value={form.discountValue}
                onChange={(e) => set("discountValue", e.target.value)}
                placeholder="VD: 10000"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đơn tối thiểu (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step="1000"
                value={form.minOrderValue}
                onChange={(e) => set("minOrderValue", e.target.value)}
                placeholder="VD: 50000"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giới hạn sử dụng <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="1"
              value={form.usageLimit}
              onChange={(e) => set("usageLimit", e.target.value)}
              placeholder="VD: 100"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
              className="accent-amber-600 w-4 h-4"
            />
            Kích hoạt (có thể sử dụng)
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 text-sm font-medium uppercase tracking-wider"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60 shadow-md transition-all active:scale-95"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? "Lưu thay đổi" : "Tạo voucher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Vouchers Page ──────────────────────────────────────────────────────────────
export default function Vouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const [showModal, setShowModal] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);

  const loadVouchers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllVouchers(
        currentPage - 1,
        pageSize,
        debouncedSearch,
      );
      if (result.success) {
        setVouchers(result.data.content);
        setTotalPages(result.data.totalPages);
        setTotalElements(result.data.totalElements);
      } else {
        setError(result.message || "Không thể tải danh sách voucher.");
      }
    } catch {
      setError("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    loadVouchers();
  }, [loadVouchers]);

  const handleSaved = () => {
    loadVouchers();
  };

  const handleToggleActive = async (voucher) => {
    try {
      const result = await toggleVoucherActive(voucher.id);
      if (result.success)
        setVouchers((prev) =>
          prev.map((v) => (v.id === voucher.id ? result.data : v)),
        );
    } catch {}
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const getStatusInfo = (voucher) => {
    const now = new Date();
    const start = new Date(voucher.startDate);
    const end = new Date(voucher.endDate);

    if (!voucher.isActive)
      return { label: "Ngừng hoạt động", cls: "bg-gray-100 text-gray-500" };
    if (now < start)
      return { label: "Chờ kích hoạt", cls: "bg-blue-100 text-blue-700" };
    if (now > end) return { label: "Hết hạn", cls: "bg-red-100 text-red-600" };
    if (voucher.usageCount >= voucher.usageLimit)
      return { label: "Đã dùng hết", cls: "bg-orange-100 text-orange-700" };
    return { label: "Đang hoạt động", cls: "bg-green-100 text-green-700" };
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Ticket className="text-amber-600" size={32} />
            Voucher
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý mã giảm giá và khuyến mãi
          </p>
        </div>
        <button
          onClick={() => {
            setEditingVoucher(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Tạo voucher
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã voucher..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
          />
        </div>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
        >
          {[5, 10, 15, 20].map((s) => (
            <option key={s} value={s}>
              {s} / trang
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-48 text-gray-500 gap-3">
          <Loader2 className="animate-spin" size={24} /> Đang tải voucher...
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center gap-3 text-red-600 bg-red-50 border border-red-200 p-4 rounded-xl">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-amber-50 border-b border-amber-100">
                <tr>
                  <th className="text-left px-6 py-4 font-bold text-amber-800 uppercase tracking-wider">Mã</th>
                  <th className="text-left px-6 py-4 font-bold text-amber-800 uppercase tracking-wider">Giảm giá</th>
                  <th className="text-left px-6 py-4 font-bold text-amber-800 uppercase tracking-wider">Đơn tối thiểu</th>
                  <th className="text-center px-6 py-4 font-bold text-amber-800 uppercase tracking-wider">Đã dùng</th>
                  <th className="text-left px-6 py-4 font-bold text-amber-800 uppercase tracking-wider">Thời gian</th>
                  <th className="text-center px-6 py-4 font-bold text-amber-800 uppercase tracking-wider">Trạng thái</th>
                  <th className="text-center px-6 py-4 font-bold text-amber-800 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {vouchers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-400 py-12">
                      Không tìm thấy voucher nào.
                    </td>
                  </tr>
                ) : (
                  vouchers.map((voucher) => {
                    const status = getStatusInfo(voucher);
                    const usagePercent =
                      voucher.usageLimit > 0
                        ? Math.round(
                            (voucher.usageCount / voucher.usageLimit) * 100,
                          )
                        : 0;

                    return (
                      <tr
                        key={voucher.id}
                        className={`hover:bg-amber-50/20 transition-colors ${!voucher.isActive && 'bg-gray-50 opacity-60'}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                              <Percent size={16} className="text-amber-600" />
                            </div>
                            <span className="font-bold text-gray-900 tracking-wide text-base">
                              {voucher.code}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 font-bold text-amber-700 text-base">
                          {formatCurrency(voucher.discountValue)}
                        </td>

                        <td className="px-6 py-4 text-gray-700 font-medium">
                          {formatCurrency(voucher.minOrderValue)}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="text-gray-900 font-bold text-xs uppercase tracking-wider">
                              {voucher.usageCount} / {voucher.usageLimit}
                            </span>
                            <div className="w-24 bg-gray-100 rounded-full h-2 ring-1 ring-gray-200">
                              <div
                                className="bg-amber-500 h-2 rounded-full transition-all shadow-sm"
                                style={{
                                  width: `${Math.min(usagePercent, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-xs text-gray-600 space-y-0.5 font-medium">
                            <div className="flex items-center gap-1 text-green-600">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                              {formatDate(voucher.startDate)}
                            </div>
                            <div className="flex items-center gap-1 text-red-600">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                              {formatDate(voucher.endDate)}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ring-1 ring-inset ${status.cls}`}
                          >
                            {status.label}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setEditingVoucher(voucher);
                                setShowModal(true);
                              }}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors shadow-sm"
                              title="Sửa"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleToggleActive(voucher)}
                              className={`p-2 rounded-lg transition-colors shadow-sm ${
                                voucher.isActive 
                                  ? "bg-amber-50 text-amber-600 hover:bg-amber-100" 
                                  : "bg-green-50 text-green-600 hover:bg-green-100"
                              }`}
                              title={voucher.isActive ? "Deactivate" : "Activate"}
                            >
                              {voucher.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mb-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {showModal && (
        <VoucherModal
          voucher={editingVoucher}
          onClose={() => {
            setShowModal(false);
            setEditingVoucher(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
