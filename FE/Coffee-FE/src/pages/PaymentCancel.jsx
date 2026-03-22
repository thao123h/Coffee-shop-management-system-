import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";
import { cancelOrder } from "@/service/OrderService";

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderCode = searchParams.get("orderCode");
  useEffect(() => {
    cancelOrder(orderCode)
      .then(() => {
        console.log("Order canceled successfully");
      })
      .catch((error) => {
        console.error("Error canceling order:", error);
      }); 
    // Optional: You can add any side effects here if needed when the component mounts
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Thanh toán bị hủy
        </h1>
        
        <p className="text-gray-600 mb-6">
          Giao dịch thanh toán đã bị hủy. Đơn hàng vẫn chưa được thanh toán.
        </p>

        {orderCode && (
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Mã đơn hàng</p>
            <p className="text-xl font-bold text-gray-900">#{orderCode}</p>
          </div>
        )}

        <button
          onClick={() => navigate("/dashboard/pos")}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
        >
          <ArrowLeft size={20} />
          Quay lại POS
        </button>
      </div>
    </div>
  );
}
