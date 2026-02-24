import React from "react";
import { Ticket, Plus, Edit, Trash2, Percent } from "lucide-react";

export default function Vouchers() {
  const vouchers = [
    {
      id: 1,
      code: "COFFEE10",
      discount: "10%",
      type: "Percentage",
      minOrder: 15,
      maxDiscount: 5,
      uses: 25,
      maxUses: 100,
      expires: "2026-03-31",
    },
    {
      id: 2,
      code: "WELCOME20",
      discount: "20%",
      type: "Percentage",
      minOrder: 20,
      maxDiscount: 10,
      uses: 45,
      maxUses: 50,
      expires: "2026-02-28",
    },
    {
      id: 3,
      code: "FLAT5",
      discount: "$5",
      type: "Fixed",
      minOrder: 25,
      maxDiscount: 5,
      uses: 12,
      maxUses: 200,
      expires: "2026-04-15",
    },
    {
      id: 4,
      code: "FREESHIP",
      discount: "Free Delivery",
      type: "Special",
      minOrder: 30,
      maxDiscount: 0,
      uses: 8,
      maxUses: 150,
      expires: "2026-05-01",
    },
  ];

  const getTypeBadge = (type) => {
    switch (type) {
      case "Percentage":
        return "bg-blue-100 text-blue-700";
      case "Fixed":
        return "bg-green-100 text-green-700";
      case "Special":
        return "bg-purple-100 text-purple-700";
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
            <Ticket className="text-amber-600" size={32} />
            Vouchers
          </h1>
          <p className="text-gray-600 mt-1">
            Manage discount codes and promotions
          </p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg hover:shadow-xl">
          <Plus size={20} />
          Create Voucher
        </button>
      </div>

      {/* Vouchers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {vouchers.map((voucher) => (
          <div
            key={voucher.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Percent className="text-amber-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900">
                    {voucher.code}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${getTypeBadge(voucher.type)}`}
                  >
                    {voucher.type}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-amber-600">
                  {voucher.discount}
                </p>
                <p className="text-xs text-gray-500">Discount</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">Min Order</p>
                <p className="font-semibold text-gray-900">
                  ${voucher.minOrder}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Max Discount</p>
                <p className="font-semibold text-gray-900">
                  ${voucher.maxDiscount}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Uses</p>
                <p className="font-semibold text-gray-900">
                  {voucher.uses} / {voucher.maxUses}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Expires</p>
                <p className="font-semibold text-gray-900">{voucher.expires}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-amber-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${(voucher.uses / voucher.maxUses) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                <Edit size={16} />
                Edit
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
