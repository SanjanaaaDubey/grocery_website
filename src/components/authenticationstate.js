import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from './auth'; // Ensure this path is correct

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken(); // Use getToken to retrieve token
    console.log('Token retrieved on mount:', token); // Log token retrieval
    if (token) {
      console.log('Token found, fetching user cart...');
      setUser({ token });
      fetchUserCart(token); // Fetch cart items if a token is present
    } else {
      console.log('No token found, setting loading to false.');
      setLoading(false); // Set loading to false if no token
    }
  }, []);

  const fetchUserCart = async (token) => {
    try {
      setLoading(true); // Set loading to true while fetching
      console.log('Fetching cart items with token:', token); // Log fetch attempt
      const response = await axios.get('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`, // Use Bearer token
        },
      });
      console.log('Cart items fetched successfully:', response.data); // Log successful fetch
      setCartItems(response.data); // Assuming response.data is the array of cart items
    } catch (error) {
      console.error('Error fetching cart items:', error); // Log error
      if (error.response?.status === 401) {
        console.log('Unauthorized access, logging out.');
        logout(); // Clear user data
        navigate('/login'); // Redirect to login page
      }
    } finally {
      setLoading(false); // Set loading to false after fetching
      console.log('Finished fetching cart items, loading state:', loading); // Log end of fetch
    }
  };

  const addItemToCart = async (productId, quantity) => {
    try {
      const token = getToken(); // Retrieve token
      if (!token) {
        console.error('No token found, user might not be logged in.');
        return;
      }

      console.log('Adding item to cart with token:', token); // Log add attempt
      const response = await axios.post('/api/cart/add', {
        productId,
        quantity,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`, // Use Bearer token
        },
      });

      console.log('Item added to cart successfully:', response.data); // Log success
      fetchUserCart(token); // Refresh cart items
    } catch (error) {
      console.error('Error adding item to cart:', error); // Log error
    }
  };

  const removeItemFromCart = async (productId) => {
    const token = getToken(); // Retrieve token
    if (!token) {
      console.error('No token found, user might not be logged in.');
      return;
    }
  
    try {
      const response = await axios.delete(`/api/cart/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Use Bearer token
        },
      });
  
      // Return the response data to be used in frontend
      return response.data;
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };
  
  const login = (userData) => {
    const token = userData.token;
    console.log('User logged in:', userData); // Log user data on login
    setUser(userData);
    localStorage.setItem('token', token); // Save token
    fetchUserCart(token); // Fetch cart items for the logged-in user
    navigate('/'); // Redirect to home page
  };

  const logout = () => {
    console.log('User logging out.'); // Log logout action
    setUser(null);
    setCartItems([]); // Clear cart items on logout
    localStorage.removeItem('token'); // Remove token from local storage
    navigate('/login'); // Redirect to login page
  };
  const updateCartItemQuantity = async (productId, quantity) => {
    const token = localStorage.getItem('token'); // Get token from local storage

    try {
      console.log('Updating item quantity in cart with token:', token);
      console.log('productId',productId);
      const response = await axios.put(`http://localhost:4000/api/cart/${productId}`, {
        quantity
      }, {
        headers: {
          'Authorization': `Bearer ${token}`, // Use Bearer token
        },
      });
  
      console.log('productId:', productId);
      console.log('Item quantity updated successfully:', response.data);
      fetchUserCart(token); // Refresh cart items
    } catch (error) {
      console.error('Error updating item quantity in cart:', error);
    }
  };
  
  

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, cartItems, setCartItems, loading, addItemToCart, removeItemFromCart,updateCartItemQuantity  }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;