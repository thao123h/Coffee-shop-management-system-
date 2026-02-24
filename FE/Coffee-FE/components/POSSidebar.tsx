'use client';

import { Coffee, Trash2, DollarSign } from 'lucide-react';
import { useCart } from '@/lib/cartContext';

interface POSSidebarProps {
  orderNumber?: number;
  onClearCart?: () => void;
}

export function POSSidebar({ orderNumber = 1001, onClearCart }: POSSidebarProps) {
  const { items } = useCart();

  return (
    <div className="w-24 bg-gray-900 text-white flex flex-col items-center py-6 gap-6">
      {/* Logo/Branding */}
      <div className="flex flex-col items-center gap-2">
        <div className="bg-amber-700 p-3 rounded-lg">
          <Coffee size={28} />
        </div>
        <div className="text-xs font-bold text-center text-gray-300">
          COFFEE
          <br />
          POS
        </div>
      </div>

      {/* Order Info */}
      <div className="w-full px-2 py-3 bg-gray-800 rounded-lg text-center">
        <div className="text-xs text-gray-400 mb-1">Order #</div>
        <div className="text-xl font-bold text-amber-400">{orderNumber}</div>
      </div>

      {/* Items Count */}
      <div className="w-full px-2 py-3 bg-gray-800 rounded-lg text-center">
        <div className="text-xs text-gray-400 mb-1">Items</div>
        <div className="text-xl font-bold text-white">{items.length}</div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Clear Cart Button */}
      {onClearCart && (
        <button
          onClick={onClearCart}
          className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center transition group"
          title="Clear Cart"
        >
          <Trash2 size={24} className="group-hover:scale-110 transition" />
        </button>
      )}
    </div>
  );
}
