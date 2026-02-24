'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cartContext';
import { X, Trash2, Plus, Minus } from 'lucide-react';

interface BillingPanelProps {
  onPrintBill: () => void;
}

export const BillingPanel = ({ onPrintBill }: BillingPanelProps) => {
  const { items, removeItem, updateItem, subtotal, tax, total, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile'>('card');

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold text-card-foreground">Bills</h2>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">No items added yet</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.product.id} className="bg-secondary rounded-lg p-3 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-card-foreground">{item.product.name}</h3>
                  <div className="text-xs text-muted-foreground mt-1">
                    {item.mood && <span>({item.mood}) </span>}
                    {item.size && <span>Size: {item.size} </span>}
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="p-1 hover:bg-primary hover:text-primary-foreground rounded transition-all"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateItem(item.product.id, item.quantity - 1)}
                    className="p-1 hover:bg-primary hover:text-primary-foreground rounded transition-all"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold text-card-foreground">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateItem(item.product.id, item.quantity + 1)}
                    className="p-1 hover:bg-primary hover:text-primary-foreground rounded transition-all"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="font-bold text-primary">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className="border-t border-border p-4 space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-card-foreground font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (10%)</span>
            <span className="text-card-foreground font-semibold">${tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="font-bold text-card-foreground">Total</span>
            <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-card-foreground">Payment Method</label>
          <div className="flex gap-2">
            {(['cash', 'card', 'mobile'] as const).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  paymentMethod === method
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'
                }`}
              >
                {method === 'cash' ? '💵' : method === 'card' ? '💳' : '📱'} {method}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-3">
          <button
            onClick={onPrintBill}
            disabled={items.length === 0}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Print Bills
          </button>
          <button
            onClick={clearCart}
            disabled={items.length === 0}
            className="w-full bg-destructive text-destructive-foreground py-2 rounded-lg font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};
