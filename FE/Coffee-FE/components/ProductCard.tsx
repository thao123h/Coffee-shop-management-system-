'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard = ({ product, onSelect }: ProductCardProps) => {
  return (
    <button
      onClick={() => onSelect(product)}
      className="bg-card rounded-lg overflow-hidden shadow hover:shadow-lg transition-all hover:scale-105 p-3 text-left"
    >
      <div className="relative w-full h-40 mb-3 rounded-lg overflow-hidden bg-secondary">
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
      <h3 className="font-semibold text-card-foreground text-sm mb-2">{product.name}</h3>
      <p className="text-primary font-bold text-lg">${product.price.toFixed(2)}</p>
    </button>
  );
};
