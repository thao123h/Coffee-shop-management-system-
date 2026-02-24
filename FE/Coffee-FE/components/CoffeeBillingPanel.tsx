'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cartContext';
import { Trash2, Printer, CreditCard, DollarSign, Smartphone } from 'lucide-react';
import { CartItem } from '@/lib/types';

interface CoffeeBillingPanelProps {
  onPrint?: () => void;
}

export function CoffeeBillingPanel({ onPrint }: CoffeeBillingPanelProps) {
  const { items, removeItem, updateQuantity } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile'>('cash');

  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.product.price + (item.toppings?.reduce((t, topping) => t + topping.price, 0) ?? 0);
    return sum + itemPrice * item.quantity;
  }, 0);

  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const renderCustomizations = (item: CartItem) => {
    const customizations = [];
    if (item.temperature) customizations.push(`${item.temperature === 'hot' ? '☕' : '🧊'} ${item.temperature}`);
    if (item.size) customizations.push(`Size: ${item.size}`);
    if (item.toppings && item.toppings.length > 0) {
      customizations.push(`Toppings: ${item.toppings.map(t => t.name).join(', ')}`);
    }
    if (item.notes) customizations.push(`Note: ${item.notes}`);
    return customizations;
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-600 text-white p-4">
        <h2 className="text-xl font-bold">Order Summary</h2>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p className="text-center">No items added yet</p>
          </div>
        ) : (
          items.map((item, index) => {
            const itemSubtotal = (item.product.price + (item.toppings?.reduce((t, topping) => t + topping.price, 0) ?? 0)) * item.quantity;
            const customizations = renderCustomizations(item);

            return (
              <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                {/* Item Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{item.product.name}</h4>
                    <p className="text-xs text-gray-600">${item.product.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Customizations */}
                {customizations.length > 0 && (
                  <div className="bg-white rounded p-2 mb-2 border border-gray-100">
                    {customizations.map((custom, idx) => (
                      <p key={idx} className="text-xs text-gray-600 leading-relaxed">
                        {custom}
                      </p>
                    ))}
                  </div>
                )}

                {/* Quantity and Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs font-bold"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold text-amber-700">${itemSubtotal.toFixed(2)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Totals */}
      <div className="bg-gray-50 border-t p-4 space-y-2">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Tax (10%):</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-amber-700 pt-2 border-t">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t p-4">
        <p className="text-xs font-semibold text-gray-600 mb-2">PAYMENT METHOD</p>
        <div className="space-y-2">
          {[
            { id: 'cash' as const, label: 'Cash', icon: DollarSign },
            { id: 'card' as const, label: 'Card', icon: CreditCard },
            { id: 'mobile' as const, label: 'Mobile', icon: Smartphone },
          ].map(method => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition ${
                  paymentMethod === method.id
                    ? 'bg-amber-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon size={18} />
                {method.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t p-4 space-y-2">
        <button
          onClick={onPrint}
          disabled={items.length === 0}
          className="w-full bg-amber-700 hover:bg-amber-800 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <Printer size={20} />
          Print Bill
        </button>
        <p className="text-xs text-center text-gray-500">
          {paymentMethod === 'cash' && 'Ready for cash payment'}
          {paymentMethod === 'card' && 'Processing card payment...'}
          {paymentMethod === 'mobile' && 'Ready for mobile payment'}
        </p>
      </div>
    </div>
  );
}
