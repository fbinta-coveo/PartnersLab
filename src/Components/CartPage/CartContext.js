import React, { createContext, useContext, useState } from 'react';
import usePersistedState from '../../customHooks/usePersistedState';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = usePersistedState("cart-Item",[]);

  const addToCart = (item) => {
    setCartItems((prevCartItems) => {
      const itemIndex = prevCartItems.findIndex((cartItem) => cartItem.id === item.id);
  
      if (itemIndex !== -1) {
        // Item already exists in the cart, increase its quantity
        const updatedCartItems = [...prevCartItems];
        updatedCartItems[itemIndex].quantity = item.quantity;
        return updatedCartItems;
      } else {
        // Item is not in the cart, add it as a new entry
        return [...prevCartItems, item];
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevCartItems) => prevCartItems.filter((item) => item.id !== itemId));
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        setCartItems,
        removeFromCart,
        updateCartItemQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
