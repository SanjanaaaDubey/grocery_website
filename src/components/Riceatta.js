import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './riceatta.css';
import { AuthContext } from './authenticationstate';

const Riceatta = () => {
    const [cartItems, setCartItems] = useState([]);
    const [notification, setNotification] = useState(''); // State for notification message
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const addToCart = async (productId, productName) => {
        if (!user) {
            setNotification('Please login to add items to your cart.');
            navigate('/login');
            return;
        }

        try {
            const response = await axios.post('/api/cart/add', {
                productId: productId,
                quantity: 1
            }, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            if (response.status === 200) {
                setNotification(`${productName} has been added to your cart!`); // Set notification message
                const updatedCartItems = [...cartItems];
                const itemIndex = updatedCartItems.findIndex(item => item.productId === productId);
                if (itemIndex !== -1) {
                    updatedCartItems[itemIndex].quantity += 1;
                } else {
                    updatedCartItems.push(response.data);
                }
                setCartItems(updatedCartItems);
            } else {
                setNotification('Failed to add item to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            setNotification('Error adding to cart');
        }

        // Clear the notification message after 3 seconds
        setTimeout(() => setNotification(''), 3000);
    };

    const products = [
        { id: '668c3c91c39d22304bb48c6e', name: 'Aashirvaad Atta', image: './images/aashirvaadatta.jpg', price: 350 },
        { id: '668c3c91c39d22304bb48c6f', name: 'Besan', image: './images/besan.jpg', price: 350 },
        { id: '668c3c91c39d22304bb48c70', name: 'Suji', image: './images/suji.jpg', price: 350 },
        { id: '668c3c91c39d22304bb48c71', name: 'Rice', image: './images/rice.jpg', price: 350 },
        { id: '668c3c91c39d22304bb48c72', name: 'Maida', image: './images/maida.jpg', price: 350 },
        { id: '668c3c91c39d22304bb48c73', name: 'Poha', image: './images/poha.jpg', price: 350 },
        { id: '668c3c91c39d22304bb48c74', name: 'Chana Dal', image: './images/chanadal.jpg', price: 350 },
        { id: '668c3c91c39d22304bb48c75', name: 'Fortune chakki Atta', image: './images/fortuneatta.jpg', price: 350 },
        { id: '668c3c91c39d22304bb48c76', name: 'Urad Dal', image: './images/uraddal.jpg', price: 350 },
        { id: '668c3c91c39d22304bb48c77', name: 'Sabundana', image: './images/sabundanaa.jpg', price: 350 },
        { id: '668c3c91c39d22304bb48c78', name: 'Peanuts', image: './images/peanuts.jpg', price: 350 },
    ];

    return (
        <div className='riceatta-container'>
            {notification && <div className='notification'>{notification}</div>} {/* Display notification */}
            {products.map((product) => {
                const cartItem = cartItems.find(item => item.productId === product.id);
                const quantity = cartItem ? cartItem.quantity : 0;

                return (
                    <div key={product.id} className='riceatta-section'>
                        <img src={product.image} alt={product.name} className='riceatta-products' />
                        <div className='riceatta-info'>
                            <h3>{product.name}</h3>
                            <p>Price: ₹{product.price}</p>
                            {quantity > 0 ? (
                                <div className='quantity-controls'>
                                    <button onClick={() => {/* Implement decrement logic */}}>-</button>
                                    <span>{quantity}</span>
                                    <button onClick={() => {/* Implement increment logic */}}>+</button>
                                </div>
                            ) : (
                                <button
                                    className='card-button'
                                    onClick={() => addToCart(product.id, product.name)}
                                >
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Riceatta;