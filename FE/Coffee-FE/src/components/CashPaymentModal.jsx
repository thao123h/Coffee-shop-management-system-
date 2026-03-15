import React, { useMemo, useState } from "react";

export  function CashPaymentModal({
  open,
  totalAmount,
  onClose,
  onConfirm,
}) {
  const [cashReceived, setCashReceived] = useState("");

  const quickCashOptions = [
    totalAmount,
    20000,
    50000,
    100000,
    200000,
    500000,
  ];

  const formatMoney = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const numericCashReceived = useMemo(() => {
    return Number(cashReceived || 0);
  }, [cashReceived]);

  const change = useMemo(() => {
    return numericCashReceived - totalAmount;
  }, [numericCashReceived, totalAmount]);

  const isEnough = numericCashReceived >= totalAmount;

  const handleConfirm = () => {
    if (!isEnough) return;

    onConfirm({
      cashReceived: numericCashReceived,
      change,
    });

    setCashReceived("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[420px] bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold">Thanh toán tiền mặt</h2>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">

          {/* Total */}
          <div className="flex justify-between text-lg font-semibold">
            <span>Tổng tiền</span>
            <span className="text-amber-600">
              {formatMoney(totalAmount)}
            </span>
          </div>

          {/* Cash Input */}
          <div>
            <label className="text-sm text-gray-500">
              Tiền khách đưa
            </label>

            <input
              type="number"
              min="0"
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleConfirm();
              }}
              placeholder="Nhập số tiền khách đưa"
              className="w-full mt-2 rounded-xl border border-gray-300 px-4 py-3 text-lg outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              autoFocus
            />
          </div>

          {/* Quick Cash */}
          <div className="flex flex-wrap gap-2">
            {quickCashOptions.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setCashReceived(String(amount))}
                className="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100"
              >
                {formatMoney(amount)}
              </button>
            ))}
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-gray-200 p-4 space-y-3">

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Khách đưa</span>
              <span className="font-semibold">
                {formatMoney(numericCashReceived)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tiền thối</span>
              <span className="font-semibold text-green-600">
                {change >= 0 ? formatMoney(change) : formatMoney(0)}
              </span>
            </div>

            {!isEnough && cashReceived !== "" && (
              <div className="bg-red-50 text-red-600 text-sm p-2 rounded-xl">
                Số tiền khách đưa chưa đủ.
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">

          <button
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>

          <button
            onClick={handleConfirm}
            disabled={!isEnough}
            className="rounded-xl bg-amber-600 px-4 py-2.5 font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
          >
            Xác nhận thanh toán
          </button>

        </div>
      </div>
    </div>
  );
}