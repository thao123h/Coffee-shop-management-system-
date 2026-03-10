import { useState } from "react";
import { t } from "../i18n";
import { useCart } from "../lib/CartContext";
import { DollarSign, Smartphone, QrCode } from "lucide-react";

const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + ' ₫';
};
import {
  Trash2,
  Printer,
  CreditCard,
  ShoppingBag,
  Plus,
  Minus,
} from "lucide-react";

export function CoffeeBillingPanel({ onPrint }) {
  const { items, removeItem, updateQuantity } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const subtotal = items.reduce((sum, item) => {
    const itemPrice =
      item.productVariant.price +
      (item.toppings?.reduce((t, topping) => t + topping.price, 0) ?? 0);
    return sum + itemPrice * item.quantity;
  }, 0);


  const renderCustomizations = (item) => {
    const customizations = [];
    // if (item.temperature)
    //   customizations.push(
    //     `${item.temperature === "hot" ? "☕" : "🧊"} ${item.temperature}`,
    //   );
    if (item.productVariant) customizations.push(`${item.productVariant.name}`);
    if (item.toppings && item.toppings.length > 0) {
      customizations.push(
        `Toppings: ${item.toppings.map((t) => t.name).join(", ")}`,
      );
    }
    if (item.notes) customizations.push(`Note: ${item.notes}`);
    return customizations;
  };

   const paymentMethods = [
    { id: "cash", label: t('cash'), icon: DollarSign },
    { id: "QR code", label: t('Qr code'), icon: QrCode },
   
  ];

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-screen shadow-xl">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-600 text-white p-5">
        <div className="flex items-center gap-3">
          <ShoppingBag size={24} strokeWidth={2.5} />
          <div>
            <h2 className="text-xl font-bold">{t('cart')}</h2>
            <p className="text-amber-100 text-xs">
              {items.length} {items.length === 1 ? t('item') : t('items')}
            </p>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-12 text-center">
            <div className="bg-gray-200 rounded-full p-8 mb-3">
              <ShoppingBag size={40} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-700">{t('cartIsEmpty')}</h3>
            <p className="text-sm text-gray-500">{t('addItems')}</p>
          </div>
        ) : (
          items.map((item) => {
            const itemSubtotal =
              (item.productVariant.price +
                (item.toppings?.reduce((t, topping) => t + topping.price, 0) ??
                  0)) *
              item.quantity;
            const customizations = renderCustomizations(item);

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Item Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">
                      {item.product.name} + {item.productVariant.name}
                    </h4>
                    <p className="text-xs text-gray-600">
                     {formatVND(item.productVariant.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition"
                    title={t('removeItem')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Customizations */}
                {customizations.length > 0 && (
                  <div className="bg-amber-50 rounded-lg p-2 mb-2 border border-amber-100">
                    {customizations.map((custom, idx) => (
                      <p key={idx} className="text-xs text-gray-700">
                        • {custom}
                      </p>
                    ))}
                  </div>
                )}

                {/* Quantity Controls and Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="bg-white hover:bg-gray-200 w-7 h-7 rounded-md flex items-center justify-center font-bold text-gray-700 shadow-sm transition"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold text-sm text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-white hover:bg-gray-200 w-7 h-7 rounded-md flex items-center justify-center font-bold text-gray-700 shadow-sm transition"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-lg font-bold text-amber-600">
                    {formatVND(itemSubtotal)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Totals Section - Compact */}
      <div className="bg-white border-t-2 border-gray-200 p-4">
        <div className="pt-3 border-t border-gray-300">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">{t('totalAmount')}</span>
            <span className="text-2xl font-bold text-amber-600">
              {formatVND(subtotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Methods - Compact */}
      <div className="border-t p-4 bg-gray-50">
        <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
          {t('payment')}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl font-semibold transition-all ${
                  paymentMethod === method.id
                    ? "bg-amber-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Icon size={20} strokeWidth={2.5} />
                <span className="text-xs">{method.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Button - Compact */}
      <div className="border-t p-4 bg-white">
        <button
          onClick={onPrint}
          disabled={items.length === 0}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:scale-100 disabled:shadow-none"
        >
          <Printer size={20} strokeWidth={2.5} />
          {t('completeOrder')}
        </button>
        {/* {items.length > 0 && (
          // <p className="text-xs text-center text-gray-500 mt-2">
          //   {paymentMethod === "cash" && t('cashPayment')}
          //   {paymentMethod === "QR code" && t('qrPayment')}
            
          // </p>
        )} */}
      </div>
    </div>
  );
}
