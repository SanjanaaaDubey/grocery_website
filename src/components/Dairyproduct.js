import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './colddrink.css';
import { AuthContext } from './authenticationstate';
const DairyProduct = () => {
  const [products, setProducts] = useState([
    { id: '668c3c91c39d22304bb48c56', image: ' ./images/gookul.jpg' },
    { id: '668c3c91c39d22304bb48c57', image: './images/yogurt.jpg'},
    { id: '668c3c91c39d22304bb48c58', image: './images/cheese.jpg' },
    { id: '668c3c91c39d22304bb48c59', image: './images/dahi.jpg'},
    { id: '668c3c91c39d22304bb48c5a', image: './images/brownbread.jpg'},
    { id: '668c3c91c39d22304bb48c5b', image:  './images/paneer.jpg'},
    { id: '668c3c91c39d22304bb48c5c', image:  './images/kreamymagic.jpg'},
    { id: '668c3c91c39d22304bb48c5d', image: './images/bhajipav.jpg' },
    { id: '668c3c91c39d22304bb48c5e', image: './images/bread.jpg'},
    { id: '668c3c91c39d22304bb48c5f', image:  './images/laasi.jpg'},
    { id: '668c3c91c39d22304bb48c60',  image: './images/amulkool.jpg', price: 30 },
    { id: '668c3c91c39d22304bb48c61', image: './images/darkfantasy.jpg', price: 30 },
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

export default DairyProduct;