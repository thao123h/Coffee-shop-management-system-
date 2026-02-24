'use client';

import { useState } from 'react';
import { Product, Topping } from '@/lib/types';
import { toppings as allToppings } from '@/lib/mockProducts';
import { X, Plus, Minus } from 'lucide-react';

interface CoffeeModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (cartItem: any) => void;
}

export function CoffeeModal({ product, onClose, onAddToCart }: CoffeeModalProps) {
  const [temperature, setTemperature] = useState<'hot' | 'iced'>('hot');
  const [size, setSize] = useState<'S' | 'M' | 'L'>('M');
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const calculateTotal = () => {
    const basePrice = product.price;
    const toppingsPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
    return (basePrice + toppingsPrice) * quantity;
  };

  const toggleTopping = (topping: Topping) => {
    setSelectedToppings(prev =>
      prev.find(t => t.id === topping.id)
        ? prev.filter(t => t.id !== topping.id)
        : [...prev, topping]
    );
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: `${product.id}-${Date.now()}`,
      product,
      quantity,
      temperature,
      size,
      toppings: selectedToppings,
      notes,
    };
    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-700 to-amber-600 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Product Image */}
        <div className="px-6 pt-6">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          <p className="text-gray-600 text-sm mt-3">{product.description}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Temperature Selection */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Temperature</h3>
            <div className="flex gap-3">
              {(['hot', 'iced'] as const).map(temp => (
                <button
                  key={temp}
                  onClick={() => setTemperature(temp)}
                  className={`flex-1 py-3 rounded-lg font-medium transition ${
                    temperature === temp
                      ? 'bg-amber-700 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {temp === 'hot' ? '☕ Hot' : '🧊 Iced'}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Size</h3>
            <div className="flex gap-3">
              {(['S', 'M', 'L'] as const).map(sizeOption => (
                <button
                  key={sizeOption}
                  onClick={() => setSize(sizeOption)}
                  className={`flex-1 py-3 rounded-lg font-medium transition ${
                    size === sizeOption
                      ? 'bg-amber-700 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {sizeOption}
                </button>
              ))}
            </div>
          </div>

          {/* Toppings Selection */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Toppings (+extra charge)</h3>
            <div className="space-y-2">
              {allToppings.map(topping => (
                <button
                  key={topping.id}
                  onClick={() => toggleTopping(topping)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition flex items-center justify-between ${
                    selectedToppings.find(t => t.id === topping.id)
                      ? 'border-amber-700 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span>{topping.name}</span>
                  <span className="text-amber-700 font-semibold">+${topping.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Special Notes */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Special Notes</h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g., Extra shot, light foam, etc."
              className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-700"
              rows={3}
            />
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition"
              >
                <Minus size={20} />
              </button>
              <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t p-6 space-y-3">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Total:</span>
            <span className="text-3xl font-bold text-amber-700">${calculateTotal().toFixed(2)}</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 rounded-lg transition"
          >
            Add to Cart
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
