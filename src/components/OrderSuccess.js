import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from './auth'; // Ensure this path is correct
import jsPDF from 'jspdf';
import './ordersuccess.css';

const OrderSuccess = () => {
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReceiptData = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found.');
        }

        const email = localStorage.getItem('userEmail');
        if (!email) {
          throw new Error('No user email found. Please log in again.');
        }

        const response = await fetch(`http://localhost:4000/api/orders/receipt?email=${email}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch receipt.');
        }

        const data = await response.json();
        setReceipt(data);
      } catch (error) {
        console.error('Error fetching receipt:', error);
        setError('Failed to fetch receipt. Please try again later.');
      }
    };

    fetchReceiptData();
  }, []);

  const handleContinueShopping = () => {
    navigate('/'); // Redirect to homepage or products page
  };

  const handleViewOrders = () => {
    navigate('/Vieworders'); // Navigate to the order history page
  };

  const handleDownloadReceipt = () => {
    if (!receipt) {
      alert('Receipt data is not available.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Freshmart Receipt', 10, 10);
    doc.text(`Order Date: ${new Date(receipt.orderDate).toLocaleString()}`, 10, 20);
    doc.text(`Card Number: ${receipt.cardNumber}`, 10, 30);
    doc.text(`Card Name: ${receipt.cardName}`, 10, 40);
    doc.text(`Delivery Status: ${receipt.deliveryStatus}`, 10, 50);

    let y = 60;
    doc.text('Items:', 10, y);
    receipt.items.forEach((item, index) => {
      y += 10;
      doc.text(
        `${index + 1}. Product Name: ${item.productName} | Price: $${item.price} x ${item.quantity} = $${item.price * item.quantity}`,
        10,
        y
      );
    });

    doc.text(`Subtotal: $${receipt.subtotal}`, 10, y + 20);
    doc.save('Receipt.pdf');
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="order-success-page">
      <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>Thank You!!!</h1>
      <p>Your order has been placed successfully.</p>
      <div className="order-success-buttons">
        <button className="success-button" onClick={handleContinueShopping}>
          Continue Shopping
        </button>
        <button className="success-button" onClick={handleViewOrders}>
          View My Orders
        </button>
        <button className="success-button" onClick={handleDownloadReceipt}>
          Download Receipt
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
