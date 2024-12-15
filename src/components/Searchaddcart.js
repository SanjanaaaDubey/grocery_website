import React from 'react';
import { useCart } from './Searchcart';

const ShoppingCart = () => {
  const { cartItems, addToCart, removeFromCart } = useCart();

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems.map((item) => (
        <div key={item._id}>
          <p>{item.name} - Quantity: {item.quantity}</p>
          <button onClick={() => addToCart(item, 1)}>+</button>
          <button onClick={() => removeFromCart(item._id)}>-</button>
        </div>
      ))}
    </div>
  );
};

export default ShoppingCart;
