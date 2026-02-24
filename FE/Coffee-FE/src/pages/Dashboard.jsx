import React from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      label: "Total Revenue",
      value: "$12,459",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      label: "Total Orders",
      value: "1,249",
      change: "+8.3%",
      trend: "up",
      icon: ShoppingBag,
      color: "bg-blue-500",
    },
    {
      label: "Total Customers",
      value: "856",
      change: "+15.2%",
      trend: "up",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      label: "Total Products",
      value: "142",
      change: "-2.1%",
      trend: "down",
      icon: Package,
      color: "bg-amber-500",
    },
  ];

  const recentOrders = [
    {
      id: "#ORD-001",
      customer: "John Doe",
      amount: 24.5,
      status: "completed",
      time: "5 min ago",
    },
    {
      id: "#ORD-002",
      customer: "Jane Smith",
      amount: 15.9,
      status: "pending",
      time: "12 min ago",
    },
    {
      id: "#ORD-003",
      customer: "Bob Johnson",
      amount: 32.0,
      status: "processing",
      time: "18 min ago",
    },
    {
      id: "#ORD-004",
      customer: "Alice Brown",
      amount: 4.5,
      status: "completed",
      time: "25 min ago",
    },
  ];

  const topProducts = [
    { name: "Espresso", sales: 245, revenue: 612.5 },
    { name: "Latte", sales: 189, revenue: 746.55 },
    { name: "Cappuccino", sales: 156, revenue: 663.0 },
    { name: "Americano", sales: 142, revenue: 418.9 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <Icon className="text-white" size={24} />
                </div>
                <span
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUp size={16} />
                  ) : (
                    <ArrowDown size={16} />
                  )}
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingBag className="text-amber-600" size={24} />
            Recent Orders
          </h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ${order.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">{order.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="text-amber-600" size={24} />
            Top Products
          </h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center font-bold text-amber-600">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sales} sales</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    ${product.revenue.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Chart Placeholder */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="text-amber-600" size={24} />
          Sales Overview
        </h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Chart visualization will be here</p>
        </div>
      </div>
    </div>
  );
}
