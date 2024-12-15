import React, { useEffect, useState, useContext } from 'react';
import './cartdesign.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { fetchCart, addToCart, removeFromCart,incrementQuantity,decrementQuantity } from './Cartutils';
import { AuthContext } from './authenticationstate';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const { user, removeItemFromCart,updateCartItemQuantity } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const token = user?.token;
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchCartItemsFromBackend(token);
    } else {
      console.log('No token found. Unable to fetch cart items.');
    }
  }, [token]);

  const fetchCartItemsFromBackend = async (token) => {
    try {
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`, // Use Bearer token
        },
      });
      const items = await response.json();
      if (Array.isArray(items)) {
        setCartItems(items);
      } else {
        console.error('Fetched data is not an array:', items);
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartItems([]);
    }
  };

  const handleDeleteItem = async (productId) => {
    try {
      const response = await removeItemFromCart(productId);
      setCartItems(response.cart); // Assuming response.cart is the updated cart from the backend
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleIncrement = async (itemId, currentQuantity) => {
    const newQuantity = currentQuantity + 1;
    console.log('Incrementing item:', itemId, 'Current quantity:', currentQuantity, 'New quantity:', newQuantity);

    try {
      await updateCartItemQuantity(itemId, newQuantity);
      setCartItems(prevItems => 
        prevItems.map(item =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      console.log('Quantity updated successfully for item:', itemId);
    } catch (error) {
      console.error('Error incrementing quantity:', error);
    }
  };

  const handleDecrement = async (itemId, currentQuantity) => {
    if (currentQuantity <= 1) return; // Prevent decrement below 1
    const newQuantity = currentQuantity - 1;
    console.log('Decrementing item:', itemId, 'Current quantity:', currentQuantity, 'New quantity:', newQuantity);

    try {
      await updateCartItemQuantity(itemId, newQuantity);
      setCartItems(prevItems => 
        prevItems.map(item =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      console.log('Quantity updated successfully for item:', itemId);
    } catch (error) {
      console.error('Error decrementing quantity:', error);
    }
  };


  const handleClearCart = async () => {
    try {
      setLoading(true);
      const response = await axios.delete('/api/cart/clear', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data.message);
      setCartItems([]); // Clear the cart items in state
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce((total, item) => {
    const itemPrice = parseFloat(item.price);
    const itemQuantity = parseInt(item.quantity, 10);
    if (!isNaN(itemPrice) && !isNaN(itemQuantity)) {
      return total + itemPrice * itemQuantity;
    } else {
      console.warn(`Invalid price or quantity for item: ${item.name}. Skipping.`);
      return total;
    }
  }, 0);

  const handleClick = () => {
    navigate('/Productcart');
  };

  return (
    <div className='border-container'>
      <h1>Your Cart</h1>
      {cartItems.length > 0 ? (
        <ul className='cart-container'>
          {cartItems.map((item) => (
            <div className='cart-info' key={item._id}>
              <img src={item.image} alt={item.name} className='cart-img' />
              <div className='cart-details'>
                <div className='details-container'>
                  <p>{item.name}</p>
                  <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className='quantity-control'>
                  <button onClick={() => handleDecrement(item._id, item.quantity)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleIncrement(item._id, item.quantity)}>+</button>
                </div>
              </div>
              <button
                className='delete'
                type='button'
                onClick={() => handleDeleteItem(item._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}
      <div className='subtotal'>
        <h2>Subtotal: ${subtotal.toFixed(2)}</h2>
        <button className='buy' type='button' onClick={handleClick}>
          Checkout
        </button>
        <button className='clear-cart' type='button' onClick={handleClearCart}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default CartPage;
