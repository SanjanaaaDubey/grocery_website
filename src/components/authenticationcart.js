
import axios from 'axios';
import { getToken } from './auth'; // Ensure this path is correct

const BASE_URL = '/api/cart'; // Use relative base URL if running on same domain

const cartApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch cart items
export const fetchCart = async () => {
  try {
    const token = getToken(); // Get token from local storage
    console.log('Fetching cart with token:', token); // Log token
    if (!token) {
      throw new Error('No authentication token found.');
    }
    const response = await cartApi.get('/', {
      headers: { 'Authorization': `Bearer ${token}` }, // Include token in headers
    });
    console.log('Cart items fetched:', response.data); // Log response data
    return response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data); // Log response error data
      throw error.response.data;
    } else {
      throw { message: 'Error fetching cart items' };
    }
  }
};

// Add item to cart
export const addToCart = async (productId, quantity) => {
  try {
    const token = getToken(); // Get token from local storage
    console.log('Adding to cart with token:', token, 'Product ID:', productId, 'Quantity:', quantity); // Log request details
    if (!token) {
      throw new Error('No authentication token found.');
    }
    const response = await cartApi.post('/api/cart/add', { productId, quantity }, {
      headers: { 'Authorization': `Bearer ${token}` }, // Include token in headers
    });
    console.log('Item added to cart:', response.data); // Log response data
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data); // Log response error data
      throw error.response.data;
    } else {
      throw { message: 'Error adding item to cart' };
    }
  }
};

// Remove item from cart
export const removeFromCart = async (itemId) => {
  try {
    const token = getToken(); // Get token from local storage
    console.log('Removing from cart with token:', token, 'Item ID:', itemId); // Log request details
    if (!token) {
      throw new Error('No authentication token found.');
    }
    const response = await cartApi.delete(`/${itemId}`, {
      headers: { 'Authorization': `Bearer ${token}` }, // Include token in headers
    });
    console.log('Item removed from cart:', response.data); // Log response data
    return response.data;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data); // Log response error data
      throw error.response.data;
    } else {
      throw { message: 'Error removing item from cart' };
    }
  }
};