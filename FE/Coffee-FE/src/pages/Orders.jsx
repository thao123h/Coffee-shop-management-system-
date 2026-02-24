import React from "react";
import { ShoppingBag, Eye, Printer } from "lucide-react";

export default function Orders() {
  const orders = [
    {
      id: "#ORD-001",
      customer: "John Doe",
      items: 3,
      total: 24.5,
      status: "completed",
      date: "2026-02-24 14:30",
    },
    {
      id: "#ORD-002",
      customer: "Jane Smith",
      items: 2,
      total: 15.9,
      status: "pending",
      date: "2026-02-24 14:45",
    },
    {
      id: "#ORD-003",
      customer: "Bob Johnson",
      items: 5,
      total: 32.0,
      status: "processing",
      date: "2026-02-24 15:00",
    },
    {
      id: "#ORD-004",
      customer: "Alice Brown",
      items: 1,
      total: 4.5,
      status: "completed",
      date: "2026-02-24 15:15",
    },
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
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingBag className="text-amber-600" size={32} />
            Orders
          </h1>
          <p className="text-gray-600 mt-1">View and manage customer orders</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Order ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Items
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Total
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {order.customer}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {order.items}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {order.date}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Printer size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
