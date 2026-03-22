import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Users as UsersIcon, Plus, Edit, Search, ShieldCheck, Loader2, User as UserIcon, ToggleRight, ToggleLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Pagination } from "../components/Pagination";

const API_BASE = "http://localhost:8080/api/users";

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

const ROLE_STYLES = {
  ADMIN: { bg: "bg-red-50", text: "text-red-600", label: "Quản trị viên" },
  MANAGER: { bg: "bg-blue-50", text: "text-blue-600", label: "Quản lý" },
  STAFF: { bg: "bg-green-50", text: "text-green-600", label: "Nhân viên" },
};

function UserModal({ user, onClose, onSaved, allowedRoles }) {
  const isEdit = !!user;
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
    password: "",
    role: user?.role || "STAFF",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const json = isEdit
        ? await api(`${API_BASE}/${user.id}`, { method: "PUT", body: JSON.stringify(form) })
        : await api(API_BASE, { method: "POST", body: JSON.stringify(form) });

      if (json.success) {
        onSaved();
        onClose();
        toast.success(`Người dùng đã được ${isEdit ? "cập nhật" : "tạo mới"} thành công`);
      } else setError(json.message || "Đã xảy ra lỗi.");
    } catch {
      setError("Không thể kết nối đến máy chủ.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">{isEdit ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none transition-all shadow-sm"
                placeholder="VD: Nguyễn Văn A"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tên đăng nhập</label>
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none transition-all shadow-sm"
                placeholder="VD: nguyenvana"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {isEdit ? "Mật khẩu mới (Để trống nếu giữ nguyên)" : "Mật khẩu"}
              </label>
              <input
                type="password"
                required={!isEdit}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none transition-all shadow-sm"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Vai trò</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none transition-all shadow-sm bg-white"
              >
                {allowedRoles.map((r) => <option key={r} value={r}>{ROLE_STYLES[r]?.label || r}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors uppercase font-bold text-xs tracking-wider">Hủy</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all uppercase font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 disabled:opacity-60">
              {saving && <Loader2 size={16} className="animate-spin" />}
              {isEdit ? "Cập nhật" : "Thêm nhân viên"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isManager = currentUser.role === "MANAGER";
  const allowedRoles = useMemo(() => isManager ? ["MANAGER", "STAFF"] : ["ADMIN", "MANAGER", "STAFF"], [isManager]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pageIndex = currentPage - 1;
      const json = await api(`${API_BASE}?page=${pageIndex}&size=${pageSize}&keyword=${search}`);
      if (json.success) {
        setUsers(json.data.content || []);
        setTotalPages(json.data.totalPages || 0);
      } else {
        setError(json.message || "Không thể tải danh sách người dùng.");
      }
    } catch {
      setError("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, search]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleToggleActive = async (user) => {
    try {
      const res = await api(`${API_BASE}/${user.id}/toggle-active`, { method: "PATCH" });
      if (res.success) {
        setUsers((prev) => prev.map((u) => (u.id === user.id ? res.data : u)));
        toast.success(`${user.fullName} hiện đang ${res.data.isActive ? 'Hoạt động' : 'Bị khóa'}`);
      } else toast.error(res.message || "Thao tác thất bại");
    } catch {
      toast.error("Lỗi kết nối");
    }
  };

  const handleSaved = () => {
    setCurrentPage(1);
    loadUsers();
  };

  const getRoleStyle = (role) => ROLE_STYLES[role] || { bg: "bg-gray-100", text: "text-gray-600", label: role };

  // Local filtering for roles since the API doesn't support role filtering yet
  // but it does support keyword search for name/username
  const finalUsers = users.filter(u => {
    if (isManager && u.role === "ADMIN") return false;
    if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
    return true;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <UsersIcon className="text-amber-600" size={32} />
            Quản Lý Nhân Viên
          </h1>
          <p className="text-gray-600 mt-1">Quản lý tài khoản và quyền hạn nhân viên trong hệ thống</p>
        </div>
        <button
          onClick={() => { setEditingUser(null); setShowModal(true); }}
          className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg flex items-center gap-2 active:scale-95 font-bold text-sm tracking-wide"
        >
          <Plus size={20} />
          Thêm nhân viên
        </button>
      </div>

      {/* Filters & PageSize */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc tên đăng nhập..."
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
          {[5, 10, 20, 50].map(s => (
            <option key={s} value={s}>{s} / trang</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-8 overflow-x-auto whitespace-nowrap">
        {["ALL", "ADMIN", "MANAGER", "STAFF"].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              roleFilter === r ? "bg-white text-amber-600 shadow-md" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {r === "ALL" ? "Tất cả" : ROLE_STYLES[r]?.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-amber-600" size={48} />
          <p className="text-gray-500 font-medium">Đang tải dữ liệu nhân viên...</p>
        </div>
      ) : error ? (
        <div className="p-10 text-center text-red-600 font-bold bg-red-50 rounded-2xl border border-red-100 flex items-center justify-center gap-3">
          <AlertCircle size={24} /> {error}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-orange-50 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-amber-50 border-b border-amber-100">
                  <tr>
                    <th className="text-left px-6 py-4 font-bold text-amber-800 uppercase tracking-widest text-[10px]">Nhân viên</th>
                    <th className="text-left px-6 py-4 font-bold text-amber-800 uppercase tracking-widest text-[10px]">Tên đăng nhập</th>
                    <th className="text-center px-6 py-4 font-bold text-amber-800 uppercase tracking-widest text-[10px]">Vai trò</th>
                    <th className="text-center px-6 py-4 font-bold text-amber-800 uppercase tracking-widest text-[10px]">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {finalUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-gray-400 py-12 italic">Không tìm thấy nhân viên nào.</td>
                    </tr>
                  ) : (
                    finalUsers.map((user) => {
                      const rs = getRoleStyle(user.role);
                      return (
                        <tr key={user.id} className={`hover:bg-amber-50/20 transition-colors ${!user.isActive && 'opacity-60 bg-gray-50'}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center text-amber-700 shadow-inner">
                                <UserIcon size={20} />
                              </div>
                              <span className="font-bold text-gray-900">{user.fullName} {!user.isActive && <span className="text-red-500 text-[10px] ml-1 uppercase">(Đã khóa)</span>}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-500 font-mono text-xs font-bold tracking-tight">@{user.username}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-inset shadow-sm ${rs.bg} ${rs.text} ${rs.text.replace('text-', 'ring-').replace('600', '200')}`}>
                              <ShieldCheck size={12} /> {rs.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-3">
                              <button onClick={() => { setEditingUser(user); setShowModal(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors shadow-sm" title="Chỉnh sửa"><Edit size={16} /></button>
                              <button onClick={() => handleToggleActive(user)} className={`p-2 rounded-xl transition-colors shadow-sm ${user.isActive ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`} title={user.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}>
                                {user.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
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

      {showModal && <UserModal user={editingUser} onClose={() => { setShowModal(false); setEditingUser(null); }} onSaved={handleSaved} allowedRoles={allowedRoles} />}
    </div>
  );
}
