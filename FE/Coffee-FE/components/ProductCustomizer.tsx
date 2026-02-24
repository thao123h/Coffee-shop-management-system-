'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import { X } from 'lucide-react';
import Image from 'next/image';

interface ProductCustomizerProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    quantity: number,
    mood?: 'hot' | 'cold',
    size?: 'S' | 'M' | 'L',
    sugar?: number,
    ice?: number
  ) => void;
}

export const ProductCustomizer = ({ product, onClose, onAddToCart }: ProductCustomizerProps) => {
  const [quantity, setQuantity] = useState(1);
  const [mood, setMood] = useState<'hot' | 'cold'>('cold');
  const [size, setSize] = useState<'S' | 'M' | 'L'>('M');
  const [sugar, setSugar] = useState(50);
  const [ice, setIce] = useState(50);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity, mood, size, sugar, ice);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-xl font-bold text-card-foreground">{product.name}</h2>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg transition-all">
            <X size={24} className="text-card-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Product Image */}
          <div className="relative w-full h-64 rounded-lg overflow-hidden bg-secondary">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = 'https://via.placeholder.com/400?text=' + encodeURIComponent(product.name);
              }}
            />
          </div>

          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-3">Mood</label>
            <div className="flex gap-3">
              <button
                onClick={() => setMood('hot')}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  mood === 'hot'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'
                }`}
              >
                🔥 Hot
              </button>
              <button
                onClick={() => setMood('cold')}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  mood === 'cold'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'
                }`}
              >
                ❄️ Cold
              </button>
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-3">Size</label>
            <div className="flex gap-3">
              {(['S', 'M', 'L'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    size === s
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Sugar Level */}
          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-3">
              Sugar: {sugar}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={sugar}
              onChange={(e) => setSugar(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Ice Level */}
          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-3">
              Ice: {ice}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={ice}
              onChange={(e) => setIce(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-3">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
              >
                -
              </button>
              <span className="text-xl font-bold text-card-foreground w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
              >
                +
              </button>
            </div>
          </div>

          {/* Price and Add Button */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Price:</span>
              <span className="text-2xl font-bold text-primary">${(product.price * quantity).toFixed(2)}</span>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90 transition-all"
            >
              Add to Billing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
