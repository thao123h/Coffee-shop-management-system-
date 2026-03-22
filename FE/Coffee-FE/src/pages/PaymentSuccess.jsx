import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, ArrowLeft, Loader2 } from "lucide-react";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const orderCode = searchParams.get("orderCode");
  const status = searchParams.get("status");

  useEffect(() => {
    // Simulate a brief loading state
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Đang xác nhận thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Thanh toán thành công!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Đơn hàng của bạn đã được thanh toán thành công qua PayOS.
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
