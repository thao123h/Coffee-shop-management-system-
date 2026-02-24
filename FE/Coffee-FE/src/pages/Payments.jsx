import React from "react";
import { CreditCard, TrendingUp } from "lucide-react";

export default function Payments() {
  const payments = [
    {
      id: 1,
      orderId: "#ORD-001",
      method: "Cash",
      amount: 24.5,
      date: "2026-02-24 14:30",
      status: "completed",
    },
    {
      id: 2,
      orderId: "#ORD-002",
      method: "Card",
      amount: 15.9,
      date: "2026-02-24 14:45",
      status: "pending",
    },
    {
      id: 3,
      orderId: "#ORD-003",
      method: "Mobile",
      amount: 32.0,
      date: "2026-02-24 15:00",
      status: "completed",
    },
    {
      id: 4,
      orderId: "#ORD-004",
      method: "Cash",
      amount: 4.5,
      date: "2026-02-24 15:15",
      status: "completed",
    },
  ];

  const stats = [
    { label: "Total Revenue", value: "$76.90", change: "+12.5%" },
    { label: "Cash Payments", value: "$29.00", change: "+8.3%" },
    { label: "Card Payments", value: "$15.90", change: "+5.1%" },
    { label: "Mobile Payments", value: "$32.00", change: "+15.2%" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <CreditCard className="text-amber-600" size={32} />
          Payments
        </h1>
        <p className="text-gray-600 mt-1">Track payment transactions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
          >
            <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                <TrendingUp size={16} />
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Order ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Method
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {payment.orderId}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {payment.method}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  ${payment.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {payment.date}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      payment.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
