import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/admin/orders', {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <ul>
        {orders.map(order => (
          <li key={order._id}>{order.name} - {order.total}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
