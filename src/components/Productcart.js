import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './authenticationstate'; 
import { fetchUserDetails, fetchCart, placeOrder, updateUserDetails } from './Cartutils'; 
import { useNavigate } from 'react-router-dom';
import './checkout.css';

const CheckoutPage = () => {
  const { user } = useContext(AuthContext); 
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showPaymentForm, setShowPaymentForm] = useState(false); 
  const [formData, setFormData] = useState({
    username: '',
    pincode: '',
    country: '',
    city: '',
    landmark: '',
    flatNo: '',
    area: '',
    contactno: ''
  }); 
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardName: '',
    email: ''
  });
  const [validationMessage, setValidationMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.token) {
          const details = await fetchUserDetails();
          setUserDetails(details);
          setFormData({
            username: details.username || '',
            pincode: details.pincode || '',
            country: details.country || '',
            city: details.city || '',
            landmark: details.landmark || '',
            flatNo: details.flatNo || '',
            area: details.area || '',
            contactno: details.contactno || ''
          });
        }

        const items = await fetchCart();
        setCartItems(items);
        const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
        setSubtotal(subtotal);
      } catch (error) {
        setError('Failed to fetch data.');
      }
    };

    fetchData();
  }, [user]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const [cardErrors, setCardErrors] = useState({
    cardNumber: false,
    expiryDate: false,
    cvc: false,
  });

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    setShowPaymentForm(e.target.value === 'pay-now');
  };

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    
    // Update card details state
    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  
    // Validation logic
    setCardErrors((prevErrors) => {
      let errors = { ...prevErrors };
  
      // Card number validation (must be 16 digits)
      if (name === 'cardNumber') {
        errors.cardNumber = value.length !== 16 || isNaN(value);
      }
  
      // Expiry date validation (MM/YY format, month between 1-12, and 2-digit year)
      if (name === 'expiryDate') {
        const [month, year] = value.split('/');
        errors.expiryDate =
          !/^\d{2}\/\d{2}$/.test(value) || // Check format
          parseInt(month, 10) < 1 || parseInt(month, 10) > 12 || // Check month validity
          isNaN(year) || year.length !== 2; // Check year validity
      }
  
      // CVC validation (must be 3 digits)
      if (name === 'cvc') {
        errors.cvc = value.length !== 3 || isNaN(value);
      }
      if (name === 'email') {
        errors.email = value !== userDetails.email;
      }
      
  
      return errors;
    });
  };

  const handleUserDetailsSubmit = async (e) => {
    e.preventDefault();
    const contactNumberPattern = /^[0-9]{10}$/;

  if (!contactNumberPattern.test(formData.contactno)) {
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      contactno: 'Contact number must be exactly 10 digits.',
    }));
    return; // Stop the form submission if validation fails
  } else {
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      contactno: '', // Clear any previous error
    }));
  }

    try {
      const fullAddress = `${formData.flatNo}, ${formData.area}, ${formData.city}, ${formData.country}, ${formData.pincode}`;
      const updatedData = {
        ...formData,
        address: fullAddress
      };

      await updateUserDetails(updatedData); 
      const updatedDetails = await fetchUserDetails(); 
      setUserDetails(updatedDetails); 
      setShowForm(false); 
    } catch (error) {
      console.error('Error updating user details:', error);
      setError('Failed to update user details.');
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    // Validate email
    if (!userDetails || !emailPattern.test(userDetails.email)) {
      setValidationMessage('Invalid email. Must be a valid Gmail address.');
      return;
    }

    // Validate that a payment method is selected
    if (!paymentMethod) {
      setValidationMessage('Please select a payment method before placing your order.');
      return;
    }

    // Validate card details only if "Pay Now" is selected
    if (paymentMethod === 'pay-now') {
      if (
        cardDetails.cardNumber.length !== 16 || 
        cardDetails.cvc.length !== 3 || 
        cardDetails.email !== userDetails.email
      ) {
        setValidationMessage('Invalid card details. Please check and try again.');
        return;
      }
    }

    setValidationMessage('');

    // Create order details object
    const orderDetails = {
      email: userDetails.email,  // Always use userDetails.email for both payment methods
      items: cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      paymentMethod: paymentMethod, // Include payment method
    };
    
    // Add card details only if "Pay Now" is selected
    if (paymentMethod === 'pay-now') {
      orderDetails.cardNumber = cardDetails.cardNumber;
      orderDetails.cvc = cardDetails.cvc;
      orderDetails.cardName = cardDetails.cardName;
    } else {
      // If Cash on Delivery, set fake card details
      orderDetails.cardNumber = '0000 0000 0000 0000'; // Fake card number
      orderDetails.cvc = '000';                       // Fake CVC
      orderDetails.cardName = userDetails.username;     // Indicate COD
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token available. Please log in.');
      }
    
      // Make API request to place the order
      const response = await axios.post('http://localhost:4000/api/order/', orderDetails, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    
      console.log('Order placed successfully:', response.data);
      navigate('/OrderSuccess');
    } catch (error) {
      console.error('Failed to place order:', error.response?.data || error.message);
      setError('Failed to place order. Please try again.');
    }
  };    


  const handleNewAddressClick = () => {
    setShowForm(true);
    document.body.style.overflow = 'hidden'; 
  };

  const handleCloseForm = () => {
    setShowForm(false);
    document.body.style.overflow = 'auto'; 
  };

  const handleClosePaymentForm = () => {
    setShowPaymentForm(false);
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!userDetails) {
    return <p>Loading user details...</p>;
  }

  return (
    <div className="checkout-page">
      <div className="user-details">
        <h2>Your Details</h2>
        <p><strong>Username:</strong> {userDetails.username}</p>
        <p><strong>Email:</strong> {userDetails.email}</p>
        <p><strong>Phone:</strong> {userDetails.phone}</p>
        <p><strong>Address:</strong> {userDetails.address}</p>
        <button
          className="anotheraddress"
          type="button"
          onClick={handleNewAddressClick}
        >
          Add New Address
        </button>
      </div>

      <div className="checkout-content">
        <div className="cart-summary">
          <h2>My Orders</h2>
          <ul>
            <h3>Products</h3>
            <h4>Total Price</h4>
            {cartItems.map((item) => (
              <li key={item._id} className='item-price'>
                <p><strong>{item.name}</strong></p>
                <p>₹{item.price * item.quantity}</p>
              </li>
            ))}
          </ul>
          <div className="summary-details">
            <p><strong>Shipping:</strong> ₹0.00</p>
            <p><strong>Tax:</strong> ₹0.00</p>
            <p><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
          </div>
          <div className="payment-method">
            <h3>Select Payment Method</h3>
            <label>
              <input
                type="radio"
                className='payment'
                value="cash-on-delivery"
                checked={paymentMethod === 'cash-on-delivery'}
                onChange={handlePaymentMethodChange}
              />
              Cash on Delivery
              {paymentMethod === 'cash-on-delivery' && (
                <div>Pay in cash at the time of delivery</div>
              )}
            </label>
            <label>
              <input
                type="radio"
                className='payment'
                value="pay-now"
                checked={paymentMethod === 'pay-now'}
                onChange={handlePaymentMethodChange}
              />
              Pay Now
              {paymentMethod === 'pay-now' && showPaymentForm && (
                <>
                  <div className="overlay" onClick={handleClosePaymentForm}></div>
                  <div className="payment-form show">
                    <h4>Card Details</h4>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number"
                      value={cardDetails.cardNumber}
                      onChange={handleCardDetailsChange}
                      className={`payment-input ${cardErrors.cardNumber ? 'error' : ''}`}
      />
      {cardErrors.cardNumber && <span className="error-message">Card number must be 16 digits</span>}
                    
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="Expiry Date"
                      value={cardDetails.expiryDate}
                      onChange={handleCardDetailsChange}
                      className={`payment-input ${cardErrors.expiryDate ? 'error' : ''}`}
/>
{cardErrors.expiryDate && <span className="error-message">Invalid expiry date (MM/YY)</span>}
                    <input
                      type="text"
                      name="cvc"
                      placeholder="CVC"
                      value={cardDetails.cvc}
                      onChange={handleCardDetailsChange}
                      className={`payment-input ${cardErrors.cvc ? 'error' : ''}`}
/>
{cardErrors.cvc && <span className="error-message">CVC must be 3 digits</span>}
                    <input
                      type="text"
                      name="cardName"
                      placeholder="Cardholder Name"
                      value={cardDetails.cardName}
                      onChange={handleCardDetailsChange}
                      className="payment-input"
                    />
                    <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={cardDetails.email}
                    onChange={handleCardDetailsChange}
                    className="payment-input"  // Regular input without error handling
/>
                      
                    <button className="payment-submit-button" onClick={handleOrderSubmit}>
                      Submit Payment
                    </button>
                    <button className="payment-close-button" onClick={handleClosePaymentForm}>
                      Close
                    </button>
                  </div>
                </>
              )}
            </label>
          </div>
          <button
            type="submit"
            onClick={handleOrderSubmit}
            className='checkout-button'
          >
            Place Order
          </button>
          {validationMessage && <p className="validation-message">{validationMessage}</p>}
        </div>
      </div>

      {showForm && (
        <>
          <div className="overlay" onClick={handleCloseForm}></div>
          <div className="new-account-form show">
            <h2>New Address</h2>
            <form onSubmit={handleUserDetailsSubmit}>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                placeholder="Username"
              />
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleFormChange}
                placeholder="Pincode"
              />
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleFormChange}
                placeholder="Country"
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleFormChange}
                placeholder="City"
              />
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleFormChange}
                placeholder="Landmark"
              />
              <input
                type="text"
                name="flatNo"
                value={formData.flatNo}
                onChange={handleFormChange}
                placeholder="Flat No"
              />
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleFormChange}
                placeholder="Area"
              />
              <input
              type="text"
              name="contactno"
              value={formData.contactno}
              onChange={handleFormChange}
              placeholder="Contact No"
              className={`form-input ${formErrors.contactno ? 'error' : ''}`}
              />
    {formErrors.contactno && <span className="error-message">{formErrors.contactno}</span>}
              <button type="submit">Save Address</button>
            </form>
            <button onClick={handleCloseForm}>Close</button>
          </div>
        </>
      )}
    </div>

  );
};

export default CheckoutPage;