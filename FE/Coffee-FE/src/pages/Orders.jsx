
import React, { useEffect, useState } from "react";
import { t } from "../i18n";
import { ShoppingBag, Eye } from "lucide-react";
import { Pagination } from "../components/Pagination";
import { getAllOrders } from "@/service/OrderService";
import { OrderDetailModal } from "../components/OrderDetailModal";
export default function Orders() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [selectedOrder, setSelectedOrder] = useState(null);
const [openModal, setOpenModal] = useState(false);

  const [orders, setOrders] = useState([]);
  const [totalElements, setTotalElements] = useState(0);

  const totalPages = Math.ceil(totalElements / itemsPerPage);

  const formatVND = (amount) =>
    new Intl.NumberFormat("vi-VN").format(amount) + " ₫";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getAllOrders(
          currentPage - 1,
          itemsPerPage
        );

        setOrders(res.data.content);
        setTotalElements(res.data.totalElements);
        console.log("Fetched orders:", res.data.content);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [currentPage]);

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "CANCELED":
        return "bg-red-100 text-red-700";
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
            {t("ordersPageTitle")}
          </h1>
          <p className="text-gray-600 mt-1">{t("viewManageOrders")}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                {t("orderID")}
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                {t("items")}
              </th>
              
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                {t("total")}
              </th>
              

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                {t("status")}
              </th>
               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Phương thức thanh toán
              </th>


              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
               Thời gian tạo
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                {t("actions")}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  #{order.id}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {order.orderItems?.length || 0}
                </td>

                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {formatVND(order.finalAmount)}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status === "COMPLETED"
                      ? "Hoàn thành"
                      : order.status === "PENDING"
                      ? "Chờ"
                      : order.status === "CANCELED"
                      ? "Đã hủy"
                      : order.status}
                  </span>
                </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                  {order.paymentMethod === "CASH" ? "Tiền mặt" : "QR/Chuyển khoản"}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleString("vi-VN")}
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => {
                        setSelectedOrder(order);
                        setOpenModal(true);
                      }}
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <OrderDetailModal
  open={openModal}
  order={selectedOrder}
  onClose={() => setOpenModal(false)}
/>
    </div>
  );
}

