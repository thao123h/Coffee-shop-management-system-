'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { products } from '@/lib/mockProducts';

interface ProductGridProps {
  activeCategory: string;
  onProductSelect: (product: Product) => void;
}

export const ProductGrid = ({ activeCategory, onProductSelect }: ProductGridProps) => {
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onProductSelect}
          />
        ))}
      </div>
    </div>
  );
};
