import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="abouts-container">
      <h1 className="about-title">About FreshMart</h1>
      <p className="about-paragraph">
        Welcome to <strong>FreshMart</strong>, your trusted source for fresh and quality groceries, delivered
        straight to your doorstep. We are committed to providing you with a wide variety of farm-fresh vegetables,
        fruits, and snacks, all with the convenience of online shopping.
      </p>

      <h2 className="about-subtitle">Why Shop with FreshMart?</h2>
      <ul className="about-list">
        <li className="about-list-item"><strong>Freshness You Can Trust:</strong> We source all our products from trusted local suppliers to
        ensure the best quality for you and your family.</li>
        <li className="about-list-item"><strong>Easy and Convenient:</strong> Browse through our categories—vegetables, fruits, snacks, and more—add products to your cart, and check out in just a few steps.</li>
        <li className="about-list-item"><strong>Secure Checkout:</strong> Update your address, choose a payment method, and place your order with confidence. We’ll deliver it straight to your door.</li>
        <li className="about-list-item"><strong>Order Tracking:</strong> Manage your orders anytime, track your deliveries, and get a receipt for each purchase.</li>
      </ul>

      <h2 className="about-subtitle">How It Works</h2>
      <ol className="about-steps">
        <li className="about-step">Browse our selection of fresh groceries in categories like vegetables, fruits, and snacks.</li>
        <li className="about-step">Log in to your account to add products to your cart.</li>
        <li className="about-step">Check out securely by reviewing your cart, updating your address if needed, and selecting a payment option.</li>
        <li className="about-step">Enjoy fast and reliable delivery of your groceries right to your home.</li>
        <li className="about-step">View and track your orders, and get receipts for all your purchases.</li>
      </ol>

      <h2 className="about-subtitle">Customer Support</h2>
      <p className="about-paragraph">
        If you have any questions or need assistance, our customer support team is here to help! Whether it’s
        placing an order, updating your address, or tracking a delivery, we’re just a click away.
      </p>

      <p className="about-paragraph">
        Thank you for choosing FreshMart—<strong>Freshness Delivered</strong>.
      </p>
    </div>
  );
};

export default About;
