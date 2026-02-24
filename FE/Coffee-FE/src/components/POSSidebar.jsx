import { Coffee, Trash2, ShoppingCart, Hash } from "lucide-react";
import { useCart } from "../lib/cartContext";

export function POSSidebar({ orderNumber = 1001, onClearCart }) {
  const { items } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="w-28 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center py-8 gap-6 shadow-2xl">
      {/* Logo/Branding with Animation */}
      <div className="flex flex-col items-center gap-3">
        <div className="bg-gradient-to-br from-amber-600 to-amber-700 p-4 rounded-2xl shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
          <Coffee size={32} strokeWidth={2.5} />
        </div>
        <div className="text-xs font-bold text-center text-gray-300 tracking-wider">
          COFFEE
          <br />
          <span className="text-amber-400">POS</span>
        </div>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent my-2" />

      {/* Order Info Card */}
      <div className="w-full px-3 py-4 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl text-center shadow-lg border border-gray-600 hover:border-amber-500 transition-colors">
        <Hash size={20} className="mx-auto mb-2 text-amber-400" />
        <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
          Order
        </div>
        <div className="text-2xl font-bold text-amber-400 font-mono">
          {orderNumber}
        </div>
      </div>

      {/* Items Count Card */}
      <div className="w-full px-3 py-4 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl text-center shadow-lg border border-gray-600 hover:border-amber-500 transition-colors">
        <ShoppingCart size={20} className="mx-auto mb-2 text-white" />
        <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
          Items
        </div>
        <div className="text-2xl font-bold text-white">{totalItems}</div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Clear Cart Button with Modern Design */}
      {onClearCart && (
        <button
          onClick={onClearCart}
          className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 group shadow-lg hover:shadow-red-500/50 hover:scale-105"
          title="Clear Cart"
        >
          <Trash2
            size={28}
            className="group-hover:scale-110 transition-transform"
            strokeWidth={2.5}
          />
          <span className="text-xs mt-1 font-semibold">Clear</span>
        </button>
      )}
    </div>
  );
}
