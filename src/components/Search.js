import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './items.css'; // Import the CSS file
import { AuthContext } from './authenticationstate'; // Import AuthContext

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [quantities, setQuantities] = useState({}); // State to handle quantities
  const query = new URLSearchParams(location.search).get('query');
  const { user } = useContext(AuthContext); // Use AuthContext

  useEffect(() => {
    const fetchSearchResults = async () => {
      console.log('Fetching search results for query:', query); // Log the query
      try {
        const response = await axios.get(`/api/search?query=${query}`);
        const results = response.data;
        console.log('Search results received:', results); // Log the search results

        // Initialize quantities with default value 1 for each product
        const initialQuantities = {};
        results.forEach(product => {
          initialQuantities[product._id] = 1;
        });
        setQuantities(initialQuantities);
        setSearchResults(results);
      } catch (error) {
        console.error('Error fetching search results:', error);
        alert('Error fetching search results'); // Show alert on error
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  const handleProductClick = (product) => {
    console.log('Navigating to product:', product); // Log product click
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = async (product) => {
    const quantity = quantities[product._id];
    console.log('Adding to cart:', { productId: product._id, quantity }); // Log the add to cart request

    if (!user) {
      // If user is not logged in, prompt login
      if (window.confirm('Please login to add items to your cart')) {
        navigate('/login');
      }
      return; // Prevent adding to cart without login
    }

    try {
      const response = await axios.post('/api/cart/add', {
        productId: product._id,
        quantity: quantity,
      }, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      
      console.log('Add to cart response:', response); // Log the response

      if (response.status === 200) {
        alert(`${product.name} has been added to your cart!`);
      } else {
        alert('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart');
    }
  };

  const handleQuantityChange = (productId, increment) => {
    console.log(`Changing quantity for productId: ${productId} by ${increment}`); // Log quantity change
    setQuantities(prevQuantities => {
      const newQuantity = Math.max(1, (prevQuantities[productId] || 1) + increment);
      return { ...prevQuantities, [productId]: newQuantity };
    });
  };

  return (
    <div className="search-results-container">
      {searchResults.length > 0 ? (
        searchResults.map((product) => (
          <div key={product._id} className="search-result-item">
            <img 
              src={product.image} 
              alt={product.name} 
              className="search-result-image" 
              onClick={() => handleProductClick(product)} 
            />
            <div className="search-result-details">
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>Price: ₹{product.price}</p>
            </div>
            <div className="quantity-and-price">
              <div className="quantity-control">
                <button onClick={() => handleQuantityChange(product._id, -1)}>-</button>
                <span>{quantities[product._id]}</span>
                <button onClick={() => handleQuantityChange(product._id, 1)}>+</button>
              </div>
              <p>Total Price: ${(product.price * quantities[product._id]).toFixed(2)}</p>
              <button className="add-to-cart-button" onClick={() => handleAddToCart(product)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No results found for "{query}"</p>
      )}
    </div>
  );
};

export default Search;
