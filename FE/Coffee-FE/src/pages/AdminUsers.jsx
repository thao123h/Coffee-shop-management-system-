import React, { useState, useEffect } from 'react';
import axiosClient from '../service/axiosClient';
import {
  Users,
  Search,
  Shield,
  UserCheck,
  UserCog,
  RefreshCw,
  Filter,
  BarChart2,
} from 'lucide-react';

const ROLE_CONFIG = {
  ADMIN:   { label: 'Admin',   color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  MANAGER: { label: 'Manager', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  STAFF:   { label: 'Staff',   color: 'bg-green-500/20 text-green-300 border-green-500/30' },
};

function RoleBadge({ role }) {
  const cfg = ROLE_CONFIG[role] ?? { label: role, color: 'bg-gray-500/20 text-gray-300 border-gray-500/30' };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

export default function AdminUsers() {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [error, setError]         = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get('/users');
      const rawData = res.data?.data ?? res.data;
      const data = rawData?.content ?? rawData ?? [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setError('Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u => {
    const matchSearch = u.username?.toLowerCase().includes(search.toLowerCase()) ||
                        u.fullName?.toLowerCase().includes(search.toLowerCase());
    const matchRole   = filterRole === 'ALL' || u.role === filterRole;
    const isNotAdmin  = u.role !== 'ADMIN';
    return matchSearch && matchRole && isNotAdmin;
  });

  // Stats
  const stats = [
    { label: 'Tổng người dùng', value: users.filter(u => u.role !== 'ADMIN').length, icon: Users, color: 'from-blue-600 to-blue-400' },
    { label: 'Manager', value: users.filter(u => u.role === 'MANAGER').length, icon: UserCog,  color: 'from-blue-600 to-cyan-400' },
    { label: 'Staff',   value: users.filter(u => u.role === 'STAFF').length,   icon: UserCheck, color: 'from-green-600 to-emerald-400' },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield size={28} className="text-purple-600" />
            Quản lý người dùng
          </h1>
          <p className="text-gray-500 text-sm mt-1">Thống kê và quản lý tất cả tài khoản hệ thống</p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Làm mới
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}>
                <Icon size={22} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên, username..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>
        <div className="relative">
          <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            className="pl-9 pr-8 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 appearance-none"
          >
            <option value="ALL">Tất cả Role</option>
            <option value="MANAGER">Manager</option>
            <option value="STAFF">Staff</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {error ? (
          <div className="p-10 text-center text-red-500 text-sm">{error}</div>
        ) : loading ? (
          <div className="p-10 text-center">
            <div className="w-8 h-8 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto" />
            <p className="text-gray-400 text-sm mt-3">Đang tải...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">Không tìm thấy người dùng nào.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Họ tên</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((u, i) => (
                <tr key={u.id ?? i} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4 text-gray-400">{i + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                        {u.username?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <span className="font-medium text-gray-800">{u.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{u.fullName ?? '—'}</td>
                  <td className="px-6 py-4"><RoleBadge role={u.role} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Footer */}
        {!loading && !error && (
          <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400">
            Hiển thị {filtered.length} / {users.length} người dùng
          </div>
        )}
      </div>
    </div>
  );
}
