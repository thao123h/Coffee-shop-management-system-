'use client';

import React, { useState, useRef } from 'react';
import { CartProvider, useCart } from '@/lib/cartContext';
import { Product } from '@/lib/types';
import { POSSidebar } from '@/components/POSSidebar';
import { CoffeeModal } from '@/components/CoffeeModal';
import { CoffeeBillingPanel } from '@/components/CoffeeBillingPanel';
import { products } from '@/lib/mockProducts';
import { Search } from 'lucide-react';

function POSContent() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderNumber, setOrderNumber] = useState(1001);
  const { addItem, clearCart, items } = useCart();
  const printRef = useRef<HTMLDivElement>(null);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (cartItem: any) => {
    addItem(cartItem);
  };

  const handlePrintBill = () => {
    window.print();
  };

  const handleClearCart = () => {
    if (window.confirm('Clear cart? This will remove all items.')) {
      clearCart();
      setOrderNumber(prev => prev + 1);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Compact */}
      <POSSidebar orderNumber={orderNumber} onClearCart={handleClearCart} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Coffee Shop POS</h1>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search coffee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Coffee Products Grid */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden hover:scale-105 transform duration-200 text-left"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                    <div className="text-2xl font-bold text-amber-700">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400 text-lg">No coffee found</p>
              </div>
            )}
          </div>

          {/* Right Panel - Billing */}
          <CoffeeBillingPanel onPrint={handlePrintBill} />
        </div>
      </div>

      {/* Coffee Modal */}
      <CoffeeModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Hidden Print Area */}
      <div ref={printRef} className="hidden print:block" />
    </div>
  );
}

export default function Page() {
  return (
    <CartProvider>
      <POSContent />
    </CartProvider>
  );
}
