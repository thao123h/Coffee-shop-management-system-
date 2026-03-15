import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '../service/axiosClient';
import {
  Activity,
  Server,
  Zap,
  Clock,
  RefreshCw,
  TrendingUp,
  Globe,
  Cpu,
} from 'lucide-react';

// Simple sparkline-like bar chart
function BarChart({ data = [], color = '#a78bfa' }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((v, i) => (
        <div
          key={i}
          title={`${v} requests`}
          className="flex-1 rounded-t transition-all duration-500"
          style={{ height: `${(v / max) * 100}%`, backgroundColor: color, minHeight: '2px', opacity: 0.7 + (i / data.length) * 0.3 }}
        />
      ))}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function SystemTraffic() {
  const [traffic, setTraffic]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [history, setHistory]   = useState(Array(20).fill(0));
  const pollRef = useRef(null);

  const fetchTraffic = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get('/admin/traffic');
      const data = res.data?.data ?? res.data ?? {};
      setTraffic(data);
      setHistory(prev => {
        const next = [...prev.slice(1), data.requestsLastMinute ?? 0];
        return next;
      });
      setLastUpdated(new Date());
    } catch {
      setError('Không thể tải dữ liệu traffic. Đảm bảo backend đang chạy.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTraffic();
    pollRef.current = setInterval(() => fetchTraffic(true), 10000);
    return () => clearInterval(pollRef.current);
  }, []);

  const stats = traffic
    ? [
        { icon: Zap,      label: 'Tổng request hôm nay',   value: traffic.totalRequestsToday?.toLocaleString() ?? '—', color: 'bg-gradient-to-br from-purple-600 to-purple-400' },
        { icon: TrendingUp, label: 'Request / phút (hiện tại)', value: traffic.requestsLastMinute ?? '—', color: 'bg-gradient-to-br from-blue-600 to-cyan-400' },
        { icon: Globe,    label: 'Active sessions',          value: traffic.activeSessions ?? '—', color: 'bg-gradient-to-br from-emerald-600 to-green-400' },
        { icon: Cpu,      label: 'Endpoint phổ biến nhất',  value: traffic.topEndpoint ?? '—', sub: `${traffic.topEndpointCount ?? 0} lần`, color: 'bg-gradient-to-br from-amber-600 to-orange-400' },
      ]
    : [];

  const endpoints = traffic?.endpointStats ?? [];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity size={28} className="text-purple-600" />
            System Traffic
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Thống kê traffic hệ thống theo thời gian thực
            {lastUpdated && (
              <span className="ml-2 text-xs text-gray-400">
                · Cập nhật lúc {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium bg-green-50 border border-green-100 rounded-full px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live
          </div>
          <button
            onClick={() => fetchTraffic()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Làm mới
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          ⚠️ {error}
        </div>
      )}

      {loading && !traffic ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto" />
            <p className="text-gray-400 text-sm mt-3">Đang tải dữ liệu...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(s => <StatCard key={s.label} {...s} />)}
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <TrendingUp size={18} className="text-purple-500" />
                Requests / phút (20 điểm gần nhất)
              </h2>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock size={12} /> Cập nhật mỗi 10 giây
              </span>
            </div>
            <BarChart data={history} color="#a78bfa" />
            <div className="flex justify-between text-xs text-gray-300 mt-1">
              <span>Cũ nhất</span>
              <span>Mới nhất</span>
            </div>
          </div>

          {/* Endpoint table */}
          {endpoints.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <Server size={18} className="text-purple-500" />
                <h2 className="font-semibold text-gray-800">Thống kê theo Endpoint</h2>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Endpoint</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Method</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Số lần gọi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {endpoints.map((ep, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 font-mono text-xs text-gray-700">{ep.path}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          ep.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                          ep.method === 'POST' ? 'bg-green-100 text-green-700' :
                          ep.method === 'PUT' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>{ep.method}</span>
                      </td>
                      <td className="px-6 py-3 text-right font-semibold text-gray-800">{ep.count?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Fallback if no endpoint data */}
          {endpoints.length === 0 && traffic && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-400 text-sm">
              Chưa có dữ liệu endpoint. Hệ thống sẽ thu thập sau khi có request đến.
            </div>
          )}
        </>
      )}
    </div>
  );
}
