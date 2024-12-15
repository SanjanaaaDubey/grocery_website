import axios from 'axios';
import { getToken } from './auth'; // Ensure this path is correct

const CART_API_URL = 'http://localhost:4000/api/cart';
const USER_API_URL = 'http://localhost:4000/api/user'; // Adjust if necessary
const ORDER_API_URL = 'http://localhost:4000/api/order';

// Create axios instances for cart and user APIs
const cartApi = axios.create({
  baseURL: CART_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const userApi = axios.create({
  baseURL: USER_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
const orderApi = axios.create({
  baseURL: ORDER_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Fetch cart items
export const fetchCart = async () => {
  try {
    const token = getToken(); // Get token from local storage
    if (!token) {
      console.error('No authentication token found.');
      throw new Error('No authentication token found.');
    }

    console.log('Fetching cart items with token:', token);
    const response = await cartApi.get('/', {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    console.log('Fetched cart items successfully:', response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching cart items:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data);
    }
    throw { message: 'Error fetching cart items' };
  }
};

// Add item to cart
export const addToCart = async (productId, quantity) => {
  try {
    const token = getToken(); // Get token from local storage
    if (!token) {
      console.error('No authentication token found.');
      throw new Error('No authentication token found.');
    }

    console.log('Adding item to cart with token:', token, 'Product ID:', productId, 'Quantity:', quantity);
    const response = await cartApi.post('/add', { productId, quantity }, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    console.log('Item added to cart successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data);
      throw error.response.data;
    } else {
      throw { message: 'Error adding item to cart' };
    }
  }
};
// Increment item quantity
export const incrementQuantity = async (productId) => {
  try {
    const token = getToken(); // Get token from local storage
    if (!token) {
      console.error('No authentication token found.');
      throw new Error('No authentication token found.');
    }

    console.log('Incrementing item quantity with token:', token, 'Product ID:', productId);
    const response = await cartApi.post('/update', { productId, quantity: 1 }, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    console.log('Item quantity incremented successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error incrementing item quantity:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data);
    }
    throw { message: 'Error incrementing item quantity' };
  }
};

// Decrement item quantity
export const decrementQuantity = async (productId) => {
  try {
    const token = getToken(); // Get token from local storage
    if (!token) {
      console.error('No authentication token found.');
      throw new Error('No authentication token found.');
    }

    console.log('Decrementing item quantity with token:', token, 'Product ID:', productId);
    const response = await cartApi.post('/update', { productId, quantity: -1 }, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    console.log('Item quantity decremented successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error decrementing item quantity:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data);
    }
    throw { message: 'Error decrementing item quantity' };
  }
};
export const removeFromCart = async (productId) => {
  try {
    const token = getToken();
    if (!token) {
      console.error('No authentication token found.');
      throw new Error('No authentication token found.');
    }

    console.log('Removing item from cart with token:', token, 'Product ID:', productId);
    const response = await cartApi.delete(`/remove/${productId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (response.status === 200) {
      console.log('Item removed from cart successfully:', response.data);
    } else {
      console.warn('Unexpected response status while removing item:', response.status);
    }

    // Log the updated cart items after removal to verify the deletion
    const updatedCart = await fetchCart();
    console.log('Updated cart items after removal:', updatedCart);

    return response.data;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data);
    }
    throw { message: 'Error removing item from cart' };
  }
};
// Fetch user details
export const fetchUserDetails = async () => {
  try {
    const token = getToken(); // Get token from local storage
    if (!token) {
      console.error('No authentication token found.');
      throw new Error('No authentication token found.');
    }

    console.log('Fetching user details with token:', token);
    const response = await userApi.get('/details', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.data) {
      console.error('No data returned from user details API.');
      throw new Error('No data returned from user details API.');
    }

    console.log('Fetched user details successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data);
    }
    throw { message: 'Error fetching user details' };
  }
};
// Update user details
export const updateUserDetails = async (userData) => {
  try {
    const token = getToken(); // Get token from local storage
    if (!token) {
      console.error('No authentication token found.');
      throw new Error('No authentication token found.');
    }

    console.log('Updating user details with token:', token, 'User Data:', userData);
    const response = await userApi.put('/update', userData, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    console.log('User details updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating user details:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data);
    }
    throw { message: 'Error updating user details' };
  }
};
// Fetch receipt by email
export const fetchReceipt = async (email) => {
  try {
    const token = getToken(); // Get token from local storage
    if (!token) {
      console.error('No authentication token found.');
      throw new Error('No authentication token found.');
    }

    console.log('Fetching receipt with token:', token, 'Email:', email);
    const response = await orderApi.get(`/receipt`, {
      params: { email }, // Send email as a query parameter
      headers: { 'Authorization': `Bearer ${token}` },
    });

    console.log('Receipt fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching receipt:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data);
    }
    throw { message: 'Error fetching receipt', originalError: error };
  }
};

export const placeOrder = async (orderData) => {
  try {
    const token = getToken(); // Get token from local storage
    if (!token) {
      console.error('No authentication token found.');
      throw new Error('No authentication token found.');
    }

    console.log('Placing order with token:', token, 'Order Data:', orderData);
    const response = await orderApi.post('/', orderData, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    console.log('Order placed successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data);
    }
    throw { message: 'Error placing order', originalError: error };
  }
};