import React, { useState, useEffect, useCallback } from "react";
import {
  CreditCard,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
} from "lucide-react";
import { getAllPayments } from "../service/PaymentService";
import { Pagination } from "../components/Pagination";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value ?? 0
  );

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const toIsoLocal = (dateStr) => {
  if (!dateStr) return "";
  // dateStr from <input type="datetime-local"> is "yyyy-MM-ddTHH:mm"
  return dateStr + ":00";
};

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "PENDING", label: "Đang chờ" },
  { value: "SUCCESS", label: "Thành công" },
  { value: "FAILED", label: "Thất bại" },
  { value: "CANCELLED", label: "Đã hủy" },
];

const PROVIDER_OPTIONS = [
  { value: "", label: "Tất cả phương thức" },
  { value: "CASH", label: "Tiền mặt" },
  { value: "VNPAY", label: "VNPay" },
  { value: "BANK_TRANSFER", label: "Chuyển khoản" },
  { value: "E_WALLET", label: "Ví điện tử" },
];

const statusInfo = (status) => {
  const map = {
    SUCCESS: {
      label: "Thành công",
      cls: "bg-green-100 text-green-700",
      icon: <CheckCircle2 size={12} className="inline mr-1" />,
    },
    PENDING: {
      label: "Đang chờ",
      cls: "bg-yellow-100 text-yellow-700",
      icon: <Clock size={12} className="inline mr-1" />,
    },
    FAILED: {
      label: "Thất bại",
      cls: "bg-red-100 text-red-600",
      icon: <XCircle size={12} className="inline mr-1" />,
    },
    CANCELLED: {
      label: "Đã hủy",
      cls: "bg-gray-100 text-gray-500",
      icon: <XCircle size={12} className="inline mr-1" />,
    },
  };
  return map[status] || { label: status, cls: "bg-gray-100 text-gray-600", icon: null };
};

const providerLabel = (p) => {
  const map = {
    CASH: "Tiền mặt",
    VNPAY: "VNPay",
    BANK_TRANSFER: "Chuyển khoản",
    E_WALLET: "Ví điện tử",
  };
  return map[p] || p;
};

// ─── Payments Page ────────────────────────────────────────────────────────────
export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Summary counts (from current page — will update per-page)
  const [summary, setSummary] = useState({ success: 0, pending: 0, failed: 0 });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, providerFilter, fromDate, toDate]);

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllPayments(
        currentPage - 1,
        pageSize,
        debouncedSearch,
        statusFilter,
        providerFilter,
        fromDate ? toIsoLocal(fromDate) : "",
        toDate ? toIsoLocal(toDate) : ""
      );
      if (result.success) {
        const content = result.data.content;
        setPayments(content);
        setTotalPages(result.data.totalPages);
        setTotalElements(result.data.totalElements);
        // compute summary from current page
        setSummary({
          success: content.filter((p) => p.status === "SUCCESS").length,
          pending: content.filter((p) => p.status === "PENDING").length,
          failed: content.filter(
            (p) => p.status === "FAILED" || p.status === "CANCELLED"
          ).length,
        });
      } else {
        setError(result.message || "Không thể tải dữ liệu thanh toán.");
      }
    } catch {
      setError("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch, statusFilter, providerFilter, fromDate, toDate]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setProviderFilter("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  const hasFilter =
    search || statusFilter || providerFilter || fromDate || toDate;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <CreditCard className="text-amber-600" size={32} />
          Thống kê thanh toán
        </h1>
        <p className="text-gray-600 mt-1">
          Xem lịch sử các giao dịch thanh toán theo từng đơn hàng
        </p>
      </div>

      {/* Summary Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <CreditCard size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{totalElements}</p>
              <p className="text-xs text-gray-500">Tổng giao dịch</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{summary.success}</p>
              <p className="text-xs text-gray-500">Thành công</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock size={18} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{summary.pending}</p>
              <p className="text-xs text-gray-500">Đang chờ</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle size={18} className="text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">{summary.failed}</p>
              <p className="text-xs text-gray-500">Thất bại / Hủy</p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Tìm theo Mã TXN, Order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {/* Provider */}
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
          >
            {PROVIDER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {/* From Date */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-0.5 ml-1">Từ ngày</label>
            <input
              type="datetime-local"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* To Date */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-0.5 ml-1">Đến ngày</label>
            <input
              type="datetime-local"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Page size */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
          >
            {[5, 10, 15, 20].map((s) => (
              <option key={s} value={s}>
                {s} / trang
              </option>
            ))}
          </select>

          {/* Clear */}
          {hasFilter && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 text-sm font-medium transition-colors"
            >
              <Filter size={14} />
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-48 text-gray-500 gap-3">
          <Loader2 className="animate-spin" size={24} /> Đang tải...
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center gap-3 text-red-600 bg-red-50 border border-red-200 p-4 rounded-xl">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-amber-50 border-b border-amber-100">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-amber-800">
                    Order ID
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-amber-800">
                    Phương thức
                  </th>
                  <th className="text-right px-6 py-4 font-semibold text-amber-800">
                    Số tiền
                  </th>
                  <th className="text-center px-6 py-4 font-semibold text-amber-800">
                    Trạng thái
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-amber-800">
                    Mã giao dịch
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-amber-800">
                    Ngày tạo
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-amber-800">
                    Ngày thanh toán
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center text-gray-400 py-14"
                    >
                      Không tìm thấy giao dịch nào.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => {
                    const st = statusInfo(p.status);
                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-amber-50/40 transition-colors"
                      >
                        {/* Order ID */}
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">
                            #{p.orderId ?? "—"}
                          </span>
                        </td>

                        {/* Provider */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium">
                            {providerLabel(p.provider)}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4 text-right font-semibold text-gray-900">
                          {formatCurrency(p.amount)}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${st.cls}`}
                          >
                            {st.icon}
                            {st.label}
                          </span>
                        </td>

                        {/* TxnRef */}
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                            {p.txnRef ?? "—"}
                          </span>
                        </td>

                        {/* Created At */}
                        <td className="px-6 py-4 text-xs text-gray-600">
                          {formatDate(p.createdAt)}
                        </td>

                        {/* Paid At */}
                        <td className="px-6 py-4 text-xs text-gray-600">
                          {formatDate(p.paidAt)}
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

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
