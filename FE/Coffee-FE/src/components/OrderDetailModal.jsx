
import React from "react";
import { X } from "lucide-react";


const formatVND = (amount) =>
  new Intl.NumberFormat("vi-VN").format(amount) + " ₫";

export  function OrderDetailModal({ open, order, onClose }) {
  if (!open || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[700px] max-h-[90vh] overflow-y-auto rounded-xl shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold">
            Chi tiết đơn hàng #{order.id}
          </h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Info */}
        <div className="p-5 space-y-2 text-sm">
          <p><b>Nhân viên:</b> {order.staffName}</p>
          <p><b>Phương thức:</b> {order.paymentMethod == "CASH" ? "Tiền mặt" : "Chuyển khoản"}</p>
          <p><b>Trạng thái:</b> {order.status == "COMPLETED" ? "Hoàn thành" : order.status == "PENDING" ? "Đang chờ" : "Đã hủy"}</p>
          <p>
            <b>Thời gian:</b>{" "}
            {new Date(order.createdAt).toLocaleString("vi-VN")}
          </p>

          <p>
            <b>Voucher:</b>{" "}
            {order.voucherCode ? order.voucherCode : "Không có"}
          </p>
        </div>

        {/* Items */}
        <div className="px-5 pb-5">
          <h3 className="font-bold mb-3">Danh sách món</h3>

          <table className="w-full text-sm border">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Món</th>
                <th className="p-2">SL</th>
                <th className="p-2">Giá</th>
                <th className="p-2">Topping</th>
              </tr>
            </thead>

            <tbody>
              {order.orderItems.map((item, index) => (
                <tr key={index} className="border-t">

                  <td className="p-2">
                    <div>
                      <div className="font-semibold">
                        {item.productName} - {item.variantName}
                      </div>
                      {item.note && (
                        <div className="text-xs text-gray-500">
                          Note: {item.note}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="p-2 text-center">{item.quantity}</td>

                  <td className="p-2 text-center">
                    {formatVND(item.unitPrice)}
                  </td>

                  <td className="p-2">
                    {item.toppings?.length > 0
                      ? item.toppings.map((t) => t.name).join(", ")
                      : "-"}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="border-t p-5 text-sm space-y-1">
          <div className="flex justify-between">
            <span>Tạm tính</span>
            <span>{formatVND(order.totalAmount)}</span>
          </div>

          <div className="flex justify-between">
            <span>Giảm giá</span>
            <span>-{formatVND(order.discountAmount)}</span>
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Tổng cộng</span>
            <span>{formatVND(order.finalAmount)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

