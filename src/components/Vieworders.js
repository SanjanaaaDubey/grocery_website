import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './viewyourorder.css';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
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

        console.log('Full Response:', response); 
        console.log('Fetched Orders:', response.data); // Log the fetched orders

        setOrders(response.data);
        console.log('Orders State:', orders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        if (error.response) {
          console.log('Response Status:', error.response.status);
          console.log('Response Data:', error.response.data);

          if (error.response.status === 401) {
            console.log('Unauthorized, redirecting to login.');
            navigate('/login'); // Redirect to login if unauthorized
          } else {
            console.log('Error Message:', error.message); // Log other error messages
          }
        } else {
          console.log('Error Message:', error.message); // Log error message if no response
        }
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div className="order-history-page">
      <h2>Order History</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="order-item">
            <p>Email: {order.email}</p>
            <p>Card Name: {order.cardName}</p>
            <p>Card Number: {order.cardNumber}</p>
            <p>Order Date: {new Date(order.orderDate).toLocaleString()}</p>
            <p>Delivery Status: {order.deliveryStatus}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
