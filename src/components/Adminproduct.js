import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminProducts = ({ category }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/admin/products/${category}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };
    fetchProducts();
  }, [category]);

  return (
    <div>
      <h2>{category}</h2>
      <ul>
        {products.map(product => (
          <li key={product._id}>{product.name} - {product.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProducts;
