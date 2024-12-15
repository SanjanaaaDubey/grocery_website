import React, { useEffect, useState } from 'react';
import './components/cartdesign.css';
import { fetchCartItems } from './Cartutils'; // Adjust the path as per your project structure

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await fetchCartItems();
        setCartItems(items);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchItems();
  }, []);

  return (
    <div>
      <h1>Your Cart</h1>
      <ul>
        <div className='cart-container'>
        {cartItems.map(item => (
          <div className='cart-info'>
          <li key={item._id}>
            <img src={item.image} alt={item.name} className='cart-img'/>
            <div className='cart-details'>
            <p>Name: {item.name}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Total Price: ${item.price * item.quantity}</p>
            </div>
          </li>
          </div>
        ))}
        </div>
      </ul>
    </div>
  );
};

export default CartPage;
