import React, { useEffect, useState } from "react";
import { X, RefreshCcw, QrCode } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

export function QrPaymentOverlay({
  open,
  order,
  qrImageUrl, // thực chất là checkoutUrl
  expiresIn = 120,
  onClose,
  onCheckPayment,
  onRefreshQr,
}) {
  const [secondsLeft, setSecondsLeft] = useState(expiresIn);
  const [loadingQr, setLoadingQr] = useState(false);

  // reset timer khi mở
  useEffect(() => {
    if (!open) return;
    setSecondsLeft(expiresIn);
  }, [open, expiresIn, order?.id]);

  // countdown
  useEffect(() => {
    if (!open || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [open, secondsLeft]);

  // loading QR khi có link mới
  useEffect(() => {
    if (qrImageUrl) {
      setLoadingQr(true);
      setTimeout(() => setLoadingQr(false), 500); // fake loading cho UX mượt
    }
  }, [qrImageUrl]);

  if (!open || !order) return null;

  const formatMoney = (value) =>
    `${Number(value || 0).toLocaleString("vi-VN")} đ`;

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  const isExpired = secondsLeft <= 0;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="flex h-full flex-col lg:flex-row">
        <div className="flex-1 bg-gray-50 px-6 py-5 lg:px-10 lg:py-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Thanh toán QR</div>
              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                Order #{order.id}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl border border-gray-300 p-2 text-gray-600 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            {/* QR Section */}
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-200">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="mb-4 rounded-full bg-amber-100 p-4 text-amber-700">
                  <QrCode size={32} />
                </div>

                <div className="text-sm text-gray-500">
                  Số tiền cần thanh toán
                </div>

                <div className="mt-1 text-4xl font-bold text-amber-700">
                  {formatMoney(order.finalTotal ?? order.total)}
                </div>

                {/* QR BOX */}
                <div className="mt-6 flex h-72 w-72 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-4">
                  
                  {loadingQr ? (
                    <p className="text-gray-500">Đang tạo QR...</p>
                  ) : qrImageUrl ? (
                    <QRCode
                      value={qrImageUrl}
                      size={220}
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <QrCode size={64} className="mx-auto mb-3" />
                      <p>QR sẽ hiển thị ở đây</p>
                    </div>
                  )}

                </div>

                {/* Timer */}
                <div className="mt-5 text-sm text-gray-500">
                  {isExpired
                    ? "Mã QR đã hết hạn"
                    : `Hết hạn sau ${minutes}:${seconds}`}
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="space-y-4">
              {/* Guide */}
              <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Hướng dẫn
                </h3>
                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <p>1. Mở app ngân hàng hoặc ví điện tử.</p>
                  <p>2. Quét mã QR để thanh toán đúng số tiền.</p>
                  <p>3. Hệ thống sẽ tự xác nhận sau khi thanh toán.</p>
                </div>
              </div>

              {/* Actions */}
              <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Trạng thái</span>
                  <span className="font-semibold text-amber-700">
                    {isExpired ? "Expired" : "Đang chờ thanh toán"}
                  </span>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  <button
                    onClick={onCheckPayment}
                    disabled={isExpired}
                    className="rounded-xl bg-amber-600 px-4 py-3 font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
                  >
                    Tôi đã nhận thanh toán
                  </button>

                  <button
                    onClick={onRefreshQr}
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-gray-700 hover:bg-gray-50"
                  >
                    <RefreshCcw size={16} />
                    Làm mới QR
                  </button>

                  <button
                    onClick={onClose}
                    className="rounded-xl border border-red-200 px-4 py-3 text-red-600 hover:bg-red-50"
                  >
                    Hủy giao dịch
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}