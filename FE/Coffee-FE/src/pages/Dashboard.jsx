import React, { useState, useEffect } from "react";
import { t } from "../i18n";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  ArrowUp,
  Clock,
} from "lucide-react";
import { getDashboardStats } from "../service/AdminService";
import { format } from "date-fns";

const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount || 0)) + ' ₫';
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboardStats();
        setData(res.data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const stats = [
    {
      label: "Doanh thu",
      value: formatVND(data?.totalRevenue),
      icon: DollarSign,
      color: "bg-green-500",
      detail: "Tổng doanh thu tích lũy"
    },
    {
      label: "Đơn hàng",
      value: data?.totalOrders?.toLocaleString() || "0",
      icon: ShoppingBag,
      color: "bg-blue-500",
      detail: `${data?.completedOrders} hoàn thành / ${data?.pendingOrders} đang chờ`
    },
    {
      label: "Khách hàng",
      value: data?.totalUsers?.toLocaleString() || "0",
      icon: Users,
      color: "bg-purple-500",
      detail: "Tổng số tài khoản"
    },
    {
      label: "Sản phẩm",
      value: data?.totalProducts?.toLocaleString() || "0",
      icon: Package,
      color: "bg-amber-500",
      detail: `${data?.totalCategories} danh mục`
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case "COMPLETED": return "Hoàn thành";
      case "PENDING": return "Chờ xử lý";
      case "CANCELLED": return "Đã hủy";
      default: return status;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboardOverview')}</h1>
        <p className="text-gray-600 mt-1">
          Dữ liệu trực tiếp từ hệ thống quản lý cà phê của bạn.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={12} />
                {stat.detail}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 overflow-hidden">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 px-1">
            <ShoppingBag className="text-blue-500" size={24} />
            Đơn hàng gần đây
          </h2>
          <div className="space-y-4">
            {data?.recentOrders?.map((order) => (
              <div
                key={order.id}
                className="group flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all"
              >
                <div className="flex-1">
                  <p className="font-bold text-gray-900">#ORD-{order.id}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Users size={12} />
                    {order.staffName || "Staff"}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${getStatusColor(order.status)}`}
                  >
                    {translateStatus(order.status)}
                  </span>
                  <div className="text-right min-w-[100px]">
                    <p className="font-bold text-amber-600">
                      {formatVND(order.finalAmount)}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      {order.createdAt ? format(new Date(order.createdAt), "HH:mm dd/MM") : "Just now"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {data?.recentOrders?.length === 0 && (
                <div className="text-center py-12 text-gray-400">Chưa có đơn hàng nào</div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 px-1">
            <TrendingUp className="text-green-500" size={24} />
            Sản phẩm bán chạy nhất
          </h2>
          <div className="space-y-5">
            {data?.topProducts?.map((product, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-sm
                  ${index === 0 ? "bg-amber-100 text-amber-600 border border-amber-200" : 
                    index === 1 ? "bg-gray-100 text-gray-600 border border-gray-200" : 
                    "bg-orange-50 text-orange-600 border border-orange-100"}`}>
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{product.name}</p>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2">
                    <div 
                        className="bg-amber-500 h-1.5 rounded-full" 
                        style={{ width: `${Math.min(100, (product.sales / (data?.topProducts[0]?.sales || 1)) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase font-semibold">
                    {product.sales} lượt bán
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {formatVND(product.revenue)}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium italic">Doanh thu</p>
                </div>
              </div>
            ))}
            {data?.topProducts?.length === 0 && (
                <div className="text-center py-12 text-gray-400">Chưa có dữ liệu sản phẩm</div>
            )}
          </div>
        </div>
      </div>

      {/* Sales Trend (Horizontal bar display for recent days) */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="text-amber-500" size={24} />
          Xu hướng doanh thu (7 ngày)
        </h2>
        <div className="h-64 flex items-end justify-between px-4 pb-8 border-b border-gray-100">
          {data?.dailyRevenue?.map((day, i) => (
            <div key={i} className="flex flex-col items-center flex-1 group gap-2">
                <div className="relative w-full flex flex-col items-center">
                    <div className="absolute -top-8 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {formatVND(day.revenue)}
                    </div>
                    <div 
                        className="w-12 bg-amber-500/80 hover:bg-amber-500 rounded-t-lg transition-all duration-500 cursor-pointer shadow-sm group-hover:shadow-md"
                        style={{ height: `${Math.max(10, Math.min(200, (day.revenue / (Math.max(...data.dailyRevenue.map(d => d.revenue)) || 1)) * 200))}px` }}
                    ></div>
                </div>
                <p className="text-[10px] font-bold text-gray-500">{day.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
