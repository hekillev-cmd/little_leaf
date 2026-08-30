import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getCartCount, getCartTotal, PRODUCTS } from "@/lib/catalog";

type Cart = Record<string, number>;

type StoreContextValue = {
  cart: Cart;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
};

export const addCartItem = (cart: Cart, productId: string): Cart => ({ ...cart, [productId]: (cart[productId] || 0) + 1 });

export const removeCartItem = (cart: Cart, productId: string): Cart => {
  const next = { ...cart };
  delete next[productId];
  return next;
};

export const setCartQuantity = (cart: Cart, productId: string, quantity: number): Cart =>
  quantity <= 0 ? removeCartItem(cart, productId) : { ...cart, [productId]: quantity };

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(() => {
    try {
      const saved = localStorage.getItem("little-leaf-cart");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("little-leaf-cart", JSON.stringify(cart));
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      addToCart: (productId: string) => setCart((current) => addCartItem(current, productId)),
      removeFromCart: (productId: string) => setCart((current) => removeCartItem(current, productId)),
      updateQuantity: (productId: string, quantity: number) => setCart((current) => setCartQuantity(current, productId, quantity)),
      clearCart: () => setCart({}),
      cartCount: getCartCount(cart),
      cartTotal: getCartTotal(cart),
    }),
    [cart],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside StoreProvider");
  return value;
}

export function getCartProducts(cart: Cart) {
  return PRODUCTS.filter((product) => cart[product.id]);
}
