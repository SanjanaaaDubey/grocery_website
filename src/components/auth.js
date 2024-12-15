import axios from 'axios';

// Define base URLs
const AUTH_BASE_URL = 'http://localhost:4000/api/auth'; // Ensure this is correct
const CART_BASE_URL = 'http://localhost:4000/api/cart'; // Ensure this is correct

// Create API instances
const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const cartApi = axios.create({
  baseURL: CART_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define functions
export const login = async (credentials) => {
  try {
    console.log('Login request:', credentials); // Log login request
    const response = await authApi.post('/login', credentials);
    const { token, user } = response.data; // Ensure response contains user
    if (!user || !user.email) {
      throw new Error('User email not found in response');
    }
    console.log('Login successful, token:', token); // Log successful login and token
    localStorage.setItem('token', token); // Save token to localStorage
    localStorage.setItem('userEmail', user.email); // Save user email to localStorage
    return { token, user }; // Return both token and user
  } catch (error) {
    console.error('Login error:', error.message);
    throw error.response?.data || { message: 'Login failed' }; // Improve error handling
  }
};


export const getToken = () => {
  const token = localStorage.getItem('token');
  console.log('Token in getToken:', token); // Debugging line
  return token;
};

export const fetchCart = async () => {
  try {
    const token = getToken(); // Get token from local storage
    console.log('Fetching cart with token:', token); // Log token
    if (!token) {
      throw new Error('No token found'); // Handle missing token
    }
    const response = await cartApi.get('/', {
      headers: { 'Authorization': `Bearer ${token}` }, // Include token in headers
    });
    console.log('Cart fetched successfully:', response.data); // Log cart data
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error.response?.data || { message: 'Error fetching cart' }; // Improve error handling
  }
};

export const addToCart = async (productId, quantity) => {
  try {
    const token = getToken(); // Get token from local storage
    console.log('Adding to cart with token:', token, 'Product ID:', productId, 'Quantity:', quantity); // Log request details
    if (!token) {
      throw new Error('No token found'); // Handle missing token
    }
    const response = await cartApi.post('/api/cartadd', { productId, quantity }, {
      headers: { 'Authorization': `Bearer ${token}` }, // Include token in headers
    });
    console.log('Item added to cart:', response.data); // Log response data
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error.response?.data || { message: 'Error adding item to cart' }; // Improve error handling
  }
};

export const removeFromCart = async (productId) => {
  try {
    const token = getToken(); // Get token from local storage
    console.log('Removing from cart with token:', token, 'Product ID:', productId); // Log request details
    if (!token) {
      throw new Error('No token found'); // Handle missing token
    }
    const response = await cartApi.delete(`/remove/${productId}`, {
      headers: { 'Authorization': `Bearer ${token}` }, // Include token in headers
    });
    console.log('Item removed from cart:', response.data); // Log response data
    return response.data;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error.response?.data || { message: 'Error removing item from cart' }; // Improve error handling
  }
};