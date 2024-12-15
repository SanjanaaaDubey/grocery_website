import React, { createContext, useContext, useState, useEffect } from 'react';
import { addToCart as addToCartApi, fetchCart as fetchCartApi, removeFromCart as removeFromCartApi, incrementQuantity as incrementQuantityApi, decrementQuantity as decrementQuantityApi } from './Cartutils';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const items = await fetchCartApi(); // Use the fetchCart function from Cartutils
          setCartItems(items);
        } catch (error) {
          console.error('Error fetching cart items:', error);
          // Fallback to local storage if fetching fails
          const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
          setCartItems(savedCartItems);
        }
      } else {
        const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(savedCartItems);
      }
      setLoading(false); // Set loading to false after fetching
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = async (product, quantity) => {
    try {
      const itemIndex = cartItems.findIndex((item) => item.productId === product.id);

      if (itemIndex !== -1) {
        const updatedCartItems = [...cartItems];
        updatedCartItems[itemIndex].quantity += quantity;
        setCartItems(updatedCartItems);
      } else {
        setCartItems([...cartItems, { productId: product.id, quantity,name: product.name, image: product.image, price: product.price}]);
      }

      const token = localStorage.getItem('token');
      if (token) {
        await addToCartApi(product.id, quantity); // Use the addToCart function from Cartutils
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const updatedCartItems = cartItems.filter((item) => item.productId !== productId);
      setCartItems(updatedCartItems);

      const token = localStorage.getItem('token');
      if (token) {
        await removeFromCartApi(productId); // Use the removeFromCart function from Cartutils
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const incrementQuantity = async (productId) => {
    try {
      const updatedCartItems = [...cartItems];
      const itemIndex = updatedCartItems.findIndex((item) => item.productId === productId);
      if (itemIndex !== -1) {
        updatedCartItems[itemIndex].quantity += 1;
        setCartItems(updatedCartItems);

        const token = localStorage.getItem('token');
        if (token) {
          await incrementQuantityApi(productId); // Use the incrementQuantity function from Cartutils
        }
      }
    } catch (error) {
      console.error('Error incrementing item quantity:', error);
    }
  };

  const decrementQuantity = async (productId) => {
    try {
      const updatedCartItems = [...cartItems];
      const itemIndex = updatedCartItems.findIndex((item) => item.productId === productId);
      if (itemIndex !== -1) {
        if (updatedCartItems[itemIndex].quantity > 1) {
          updatedCartItems[itemIndex].quantity -= 1;
          setCartItems(updatedCartItems);
        } else {
          updatedCartItems.splice(itemIndex, 1);
          setCartItems(updatedCartItems);
        }

        const token = localStorage.getItem('token');
        if (token) {
          await decrementQuantityApi(productId); // Use the decrementQuantity function from Cartutils
        }
      }
    } catch (error) {
      console.error('Error decrementing item quantity:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, incrementQuantity, decrementQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
