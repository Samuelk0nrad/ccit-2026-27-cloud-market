/**
 * Einfache In-Memory-"Datenbank" fuer den Monolithen.
 */

import { v4 as uuid } from "uuid";

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  orders: Order[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type Carts = Record<string, CartItem[]>;

export const products: Product[] = [
  { id: "p-001", name: "Mechanische Tastatur", price: 89.9, stock: 42, category: "Peripherie" },
  { id: "p-002", name: "27-Zoll Monitor", price: 219.0, stock: 15, category: "Peripherie" },
  { id: "p-003", name: "USB-C Dockingstation", price: 59.5, stock: 60, category: "Zubehoer" },
  { id: "p-004", name: "Webcam 1080p", price: 34.99, stock: 0, category: "Zubehoer" },
  { id: "p-005", name: "Laptop-Staender", price: 24.0, stock: 100, category: "Zubehoer" }
];

export const users: User[] = [
  {
    id: "u-001",
    username: "demo",
    email: "demo@cloudmarket.local",
    passwordHash: "not-a-real-hash",
    orders: []
  }
];

// carts: userId -> [{ productId, quantity }]
export const carts: Carts = {};

export { uuid };
