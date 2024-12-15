import React from 'react';
import { useLocation } from 'react-router-dom';
import './items.css';

const Item = () => {
  const location = useLocation();
  const { item } = location.state || {};

  return (
    <div className="item-container">
      {item ? (
        <div>
          <h1>{item.name}</h1>
          <img 
            src={item.pic} 
            alt={item.name} 
            style={{ maxWidth: '100px', height: 'auto', display: 'block', margin: '0 auto 20px' }} 
          />
          <p>{item.description}</p>
          <p className="price">Price: ${item.price.toFixed(2)}</p>
        </div>
      ) : (
        <p>No item to display</p>
      )}
    </div>
  );
};

export default Item;
