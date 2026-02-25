import React, { useState, useEffect, useCallback } from "react";
import {
  Users, Plus, Edit, Trash2, Search,
  Loader2, AlertCircle, ShieldCheck, User as UserIcon, Eye, EyeOff
} from "lucide-react";

const API_BASE = "http://localhost:8080/api/users";
const ROLES = ["STAFF", "MANAGER", "ADMIN"];

const ROLE_STYLES = {
  ADMIN: { bg: "bg-red-100", text: "text-red-700", label: "Admin" },
  MANAGER: { bg: "bg-blue-100", text: "text-blue-700", label: "Manager" },
  STAFF: { bg: "bg-green-100", text: "text-green-700", label: "Staff" },
};

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

const EMPTY_FORM = { username: "", password: "", fullName: "", role: "STAFF" };

// ── Modal for Create / Edit ──────────────────────────────────────────────────
function UserModal({ user, onClose, onSaved }) {
  const isEdit = Boolean(user);
  const [form, setForm] = useState(
    isEdit
      ? { username: user.username, password: "", fullName: user.fullName, role: user.role }
      : EMPTY_FORM
  );
  const [showPwd, setShowPwd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const body = { ...form };
      if (isEdit && !body.password) delete body.password; // keep existing if blank
      const json = isEdit
        ? await api(`${API_BASE}/${user.id}`, { method: "PUT", body: JSON.stringify(body) })
        : await api(API_BASE, { method: "POST", body: JSON.stringify(body) });
      if (json.success) { onSaved(json.data, isEdit); onClose(); }
      else setError(json.message || "An error occurred.");
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
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <UserIcon size={20} className="text-amber-600" />
            {isEdit ? "Edit User" : "Add User"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text" required value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="e.g. Nguyễn Văn A"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text" required value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="e.g. nhanvien01"
              maxLength={20}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {!isEdit && <span className="text-red-500">*</span>}
              {isEdit && <span className="text-gray-400 text-xs ml-1">(leave blank to keep current)</span>}
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={form.password}
                required={!isEdit}
                minLength={isEdit ? 0 : 6}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={isEdit ? "New password (optional)" : "Min. 6 characters"}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select required value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white">
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 text-sm">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Users Page ───────────────────────────────────────────────────────────────
export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const json = await api(API_BASE);
      if (json.success) setUsers(json.data);
      else setError(json.message || "Cannot load users.");
    } catch {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleSaved = (saved, isEdit) => {
    setUsers((prev) =>
      isEdit ? prev.map((u) => (u.id === saved.id ? saved : u)) : [...prev, saved]
    );
  };

  const handleDelete = async (id) => {
    try {
      const json = await api(`${API_BASE}/${id}`, { method: "DELETE" });
      if (json.success) setUsers((prev) => prev.filter((u) => u.id !== id));
      else alert("Delete failed: " + json.message);
    } catch {
      alert("Cannot connect to server.");
    } finally {
      setDeletingId(null);
    }
  };

  const getRoleStyle = (role) => ROLE_STYLES[role] || { bg: "bg-gray-100", text: "text-gray-600", label: role };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="text-amber-600" size={32} />
            Users
          </h1>
          <p className="text-gray-600 mt-1">Manage staff accounts and roles</p>
        </div>
        <button
          onClick={() => { setEditingUser(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg hover:shadow-xl"
        >
          <Plus size={20} /> Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" placeholder="Search by name or username..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400">
          <option value="ALL">All Roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Summary */}
      {!loading && !error && (
        <div className="flex gap-4 mb-6 flex-wrap">
          {[{ label: "Total", count: users.length, color: "text-amber-600" },
          { label: "Admin", count: users.filter(u => u.role === "ADMIN").length, color: "text-red-600" },
          { label: "Manager", count: users.filter(u => u.role === "MANAGER").length, color: "text-blue-600" },
          { label: "Staff", count: users.filter(u => u.role === "STAFF").length, color: "text-green-600" },
          ].map(({ label, count, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3 flex items-center gap-3">
              <span className={`text-2xl font-bold ${color}`}>{count}</span>
              <span className="text-sm text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-48 text-gray-500 gap-3">
          <Loader2 className="animate-spin" size={24} /> Loading users...
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center gap-3 text-red-600 bg-red-50 border border-red-200 p-4 rounded-xl">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {/* Users Table */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-amber-50 border-b border-amber-100">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-amber-800">User</th>
                <th className="text-left px-6 py-4 font-semibold text-amber-800">Username</th>
                <th className="text-center px-6 py-4 font-semibold text-amber-800">Role</th>
                <th className="text-center px-6 py-4 font-semibold text-amber-800">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-gray-400 py-12">No users found.</td>
                </tr>
              ) : (
                filtered.map((user) => {
                  const rs = getRoleStyle(user.role);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      {/* User avatar + name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            {user.fullName?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-900">{user.fullName}</span>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs bg-gray-50/50">
                        @{user.username}
                      </td>

                      {/* Role badge */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${rs.bg} ${rs.text}`}>
                          <ShieldCheck size={12} /> {rs.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => { setEditingUser(user); setShowModal(true); }}
                            className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 text-xs font-medium"
                          >
                            <Edit size={13} /> Edit
                          </button>
                          <button
                            onClick={() => setDeletingId(user.id)}
                            className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 text-xs font-medium"
                          >
                            <Trash2 size={13} /> Delete
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
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <UserModal
          user={editingUser}
          onClose={() => { setShowModal(false); setEditingUser(null); }}
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
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete User?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone. The user will lose all access.</p>
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
