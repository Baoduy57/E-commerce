"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

type CartItem = {
  productId: {
    _id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
};

const CartContext = createContext<CartContextType>({
  items: [],
  fetchCart: async () => {},
  addToCart: async () => {},
  updateQuantity: async () => {},
  removeFromCart: async () => {},
});

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    return data?.user;
  };

  const fetchCart = async () => {
    const user = await getUser();
    if (!user) return;
    const res = await fetch("/api/cart", {
      headers: { "x-user-id": user.id },
    });
    if (res.ok) {
      const cart = await res.json();
      setItems(cart.items || []);
    }
  };

  const addToCart = async (productId: string, quantity: number) => {
    const user = await getUser();
    if (!user) return;
    await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user.id,
      },
      body: JSON.stringify({ productId, quantity }),
    });
    await fetchCart();
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const user = await getUser();
    if (!user) return;
    await fetch("/api/cart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user.id,
      },
      body: JSON.stringify({ productId, quantity }),
    });
    await fetchCart();
  };

  const removeFromCart = async (productId: string) => {
    const user = await getUser();
    if (!user) return;
    await fetch("/api/cart", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user.id,
      },
      body: JSON.stringify({ productId }),
    });
    await fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{ items, fetchCart, addToCart, updateQuantity, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
