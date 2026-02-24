export interface Topping {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'coffee';
  price: number;
  image: string;
  description?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  temperature?: 'hot' | 'iced';
  size?: 'S' | 'M' | 'L';
  toppings?: Topping[];
  notes?: string;
}

export interface Bill {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}
