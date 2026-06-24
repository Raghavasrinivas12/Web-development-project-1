import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const count = items.reduce((acc, item) => acc + item.quantity, 0);
    const price = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotalItems(count);
    setTotalPrice(price);
  }, [items]);

  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      const stockLimit = product.stockQuantity || Infinity;
      if (existing) {
        if (existing.quantity >= stockLimit) return prev;
        return prev.map((i) =>
          i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, newQty) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i._id !== id) return i;
        const stockLimit = i.stockQuantity || Infinity;
        if (newQty > stockLimit) return { ...i, quantity: stockLimit };
        if (newQty <= 0) return null;
        return { ...i, quantity: newQty };
      }).filter(Boolean)
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, totalItems, totalPrice, addItem, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);