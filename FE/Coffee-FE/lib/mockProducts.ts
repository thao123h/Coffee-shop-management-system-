import { Product, Topping } from './types';

export const toppings: Topping[] = [
  { id: 'topping-1', name: 'Whipped Cream', price: 0.50 },
  { id: 'topping-2', name: 'Caramel Drizzle', price: 0.75 },
  { id: 'topping-3', name: 'Chocolate Drizzle', price: 0.75 },
];

export const products: Product[] = [
  {
    id: 'coffee-1',
    name: 'Espresso',
    category: 'coffee',
    price: 2.50,
    description: 'Bold and rich espresso shot',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=400&fit=crop',
  },
  {
    id: 'coffee-2',
    name: 'Americano',
    category: 'coffee',
    price: 2.95,
    description: 'Espresso with hot water',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=400&h=400&fit=crop',
  },
  {
    id: 'coffee-3',
    name: 'Latte',
    category: 'coffee',
    price: 3.95,
    description: 'Espresso with steamed milk',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=400&h=400&fit=crop',
  },
  {
    id: 'coffee-4',
    name: 'Cappuccino',
    category: 'coffee',
    price: 4.25,
    description: 'Espresso with equal parts foam and milk',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
  },
];
