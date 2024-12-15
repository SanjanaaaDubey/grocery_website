import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './colddrink.css';
import { AuthContext } from './authenticationstate';
const Fruits = () => {
    const [products, setProducts] = useState([
    { id: '668c3c91c39d22304bb48c4a', image: './images/apple.jpg'},
    { id: '668c3c91c39d22304bb48c4b ', image: './images/papaya.jpg' },
    { id: '668c3c91c39d22304bb48c4c', image:  './images/mango.jpg'},
    { id: '668c3c91c39d22304bb48c4d', image:  './images/banana.jpg'},
    { id: '668c3c91c39d22304bb48c4e', image: './images/poemogranate.jpg' },
    { id: '668c3c91c39d22304bb48c4f', image:  './images/watermelon.jpg'},
    { id: '668c3c91c39d22304bb48c50', image:  './images/custardapple.jpg'},
    { id: '668c3c91c39d22304bb48c51', image: './images/pineapple.jpg'},
    { id: '668c3c91c39d22304bb48c52', image: './images/chicko.jpg'},
    { id: '668c3c91c39d22304bb48c53', image:  './images/grapes.jpg'},
    { id: '668c3c91c39d22304bb48c54', image:  './images/orange.jpg'},
    { id: '668c3c91c39d22304bb48c55', image:  './images/guava.jpg'},
  ]);
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get('/api/products'); // Fetch all products from the backend
        if (response.status === 200) {
          const fetchedProducts = response.data;
          // Filter out products that no longer exist in the database
          const filteredProducts = products.filter((product) =>
            fetchedProducts.some((p) => p._id === product.id)
          );
          // Update product details for the remaining products
          const updatedProducts = filteredProducts.map((product) => {
            const matchedProduct = fetchedProducts.find((p) => p._id === product.id);
            return matchedProduct
              ? { ...product, name: matchedProduct.name, price: matchedProduct.price, image: matchedProduct.image }
              : product;
          });
          setProducts(updatedProducts);
        } else {
          console.error('Failed to fetch product details');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, []); // Fetch only once on component mount

  const addToCart = async (productId, productName) => {
    if (!user) {
      setNotification('Please login to add items to your cart.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        '/api/cart/add',
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${user.token} `} }
      );
      if (response.status === 200) {
        setNotification(`${productName} has been added to your cart!`);
        const updatedCartItems = [...cartItems];
        const itemIndex = updatedCartItems.findIndex((item) => item.productId === productId);
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
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className='colddrink-container'>
      {notification && <div className='notification'>{notification}</div>}
      {products.map((product) => {
        const cartItem = cartItems.find((item) => item.productId === product.id);
        const quantity = cartItem ? cartItem.quantity : 0;

        return (
          <div key={product.id} className='colddrink-section'>
            <img
              src={product.image}
              alt={product.name || 'Product Image'}
              className='colddrink-products'
              style={{ width: '200px', height: 'auto' }}
            />
            <div className='colddrink-info'>
              <h3>{product.name || 'Loading...'}</h3>
              <p>Price: ₹{product.price !== undefined ? product.price : 'Loading...'}</p>
              {quantity > 0 ? (
                <div className='quantity-controls'>
                  <button>-</button>
                  <span>{quantity}</span>
                  <button>+</button>
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
             
 
export default Fruits;