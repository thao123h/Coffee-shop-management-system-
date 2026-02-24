'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  productCount?: number;
}

export const CategoryTabs = ({ activeCategory, onCategoryChange, productCount }: CategoryTabsProps) => {
  const categories = [
    { id: 'all', name: 'all', icon: '⭐' },
    { id: 'coffee', name: 'Coffee', icon: '☕' },
    { id: 'juice', name: 'Juice', icon: '🧃' },
    { id: 'milk-blend', name: 'Milk Blend', icon: '🥛' },
    { id: 'snack', name: 'Snack', icon: '🍪' },
    { id: 'rice', name: 'Rice', icon: '🍚' },
    { id: 'dessert', name: 'Dessert', icon: '🍰' },
  ];

  return (
    <div className="border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <span>{productCount || 0} items</span>
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
};
