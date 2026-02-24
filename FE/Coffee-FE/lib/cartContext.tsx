'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Product } from './types';

interface CartContextType {
  items: CartItem[];
  addItem: (cartItem: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  subtotal: number;
  tax: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const subtotal = items.reduce((sum, item) => {
    const toppingPrice = item.toppings?.reduce((t, topping) => t + topping.price, 0) ?? 0;
    const itemPrice = item.product.price + toppingPrice;
    return sum + itemPrice * item.quantity;
  }, 0);

  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const addItem = (cartItem: CartItem) => {
    setItems((prevItems) => [...prevItems, cartItem]);
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, updateQuantity, subtotal, tax, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
