import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './orders.css'; // Optional: Add styles for the orders page

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token
        console.log('Retrieved Token:', token); // Debugging: log the token

        if (!token) {
          console.log('No token found, redirecting to login.');
          navigate('/login'); // Redirect to login if no token is found
          return;
        }

        const response = await axios.get('http://localhost:4000/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Fetched Orders:', response.data); // Log the fetched orders

        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        if (error.response) {
          console.log('Response Status:', error.response.status);
          console.log('Response Data:', error.response.data);

          if (error.response.status === 401) {
            console.log('Unauthorized, redirecting to login.');
            navigate('/login'); // Redirect to login if unauthorized
          }
        } else {
          console.log('Error Message:', error.message); // Log error message if no response
        }
      }
    };

    fetchOrders();
  }, [navigate]);

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <h1>My Orders</h1>
        <p>You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      {orders.map((order) => (
        <div key={order._id} className="order">
          <h2>Order ID: {order._id}</h2>
          <p>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
          <ul>
            {order.items.map((item) => (
              <li key={item.productId}>
                {item.name} - {item.quantity} x ${item.price}
              </li>
            ))}
          </ul>
          <p>Total: ${order.total}</p>
        </div>
      ))}
    </div>
  );
};

export default Orders;
