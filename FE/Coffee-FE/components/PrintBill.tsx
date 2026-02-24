'use client';

import React from 'react';
import { useCart } from '@/lib/cartContext';

export const PrintBill = () => {
  const { items, subtotal, tax, total } = useCart();

  return (
    <div className="hidden print:block p-8">
      <div className="max-w-2xl mx-auto border-2 border-black p-8">
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-black pb-4">
          <h1 className="text-4xl font-bold">Coffee Shop</h1>
          <p className="text-sm mt-2">Thank you for your purchase!</p>
          <p className="text-xs mt-1 text-gray-600">{new Date().toLocaleString()}</p>
        </div>

        {/* Items */}
        <div className="mb-8">
          <div className="border-b border-gray-300 mb-4">
            <div className="grid grid-cols-4 gap-2 font-bold mb-2">
              <span className="col-span-2">Item</span>
              <span className="text-right">Qty</span>
              <span className="text-right">Amount</span>
            </div>
          </div>

          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-2 mb-2 text-sm">
              <span className="col-span-2">{item.product.name}</span>
              <span className="text-right">{item.quantity}</span>
              <span className="text-right">${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border-t-2 border-b-2 border-black py-4 space-y-2 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <span>Subtotal:</span>
            <span className="text-right">${subtotal.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <span>Tax (10%):</span>
            <span className="text-right">${tax.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 font-bold text-lg">
            <span>Total:</span>
            <span className="text-right">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs space-y-2">
          <p>Thank you for your business!</p>
          <p>Please come again</p>
        </div>
      </div>
    </div>
  );
};
