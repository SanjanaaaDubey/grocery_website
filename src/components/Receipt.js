import React from 'react';

const Receipt = ({ receipt }) => {
  // Check if receipt is defined and is an object
  if (!receipt || typeof receipt !== 'object') {
    return <div>Invalid receipt data</div>;
  }

  // Ensure receipt.items is defined and is an array
  const items = Array.isArray(receipt.items) ? receipt.items : [];

  return (
    <div className="receipt-container">
      <h2>Order Receipt</h2>
      
      <div className="receipt-details">
        <p><strong>Order Date:</strong> {receipt.orderDate ? new Date(receipt.orderDate).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Order Time:</strong> {receipt.orderTime || 'N/A'}</p>
        <p><strong>Card Name:</strong> {receipt.cardName || 'N/A'}</p>
        <p><strong>Card Number:</strong> {receipt.cardNumber || 'N/A'}</p>

        <h3>Items Purchased:</h3>
        <ul>
          {items.length > 0 ? (
            items.map((item, index) => (
              <li key={index}>
                {item.name} - Quantity: {item.quantity} - ₹{item.price}
              </li>
            ))
          ) : (
            <li>No items found in this order.</li>
          )}
        </ul>

        <h3>Total: ₹{receipt.subtotal || 0}</h3>
      </div>
    </div>
  );
};

export default Receipt;
