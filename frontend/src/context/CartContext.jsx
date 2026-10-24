import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem('cart')) || [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart());

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (book, quantity = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.book._id === book._id);
      if (found) {
        return prev.map((i) =>
          i.book._id === book._id ? { ...i, quantity: Math.min(i.quantity + quantity, book.stock) } : i
        );
      }
      return [...prev, { book, quantity: Math.min(quantity, book.stock) }];
    });
  };

  const updateQty = (id, quantity) =>
    setItems((prev) =>
      prev.map((i) => (i.book._id === id ? { ...i, quantity: Math.max(1, Math.min(quantity, i.book.stock)) } : i))
    );

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.book._id !== id));
  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.book.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, updateQty, removeItem, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
