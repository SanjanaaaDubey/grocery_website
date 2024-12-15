import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css';

const Register = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    contactno:'',
    error: '',
  });

  const { username, email, password, confirmPassword, address,contactno, error } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !email || !password || !confirmPassword || !address|| !contactno) {
      setFormData({ ...formData, error: 'All fields are required' });
      return;
    }
    if (!email.endsWith('@gmail.com')) {
      setFormData({ ...formData, error: 'Email is invalid' });
      return;
    }

    if (password !== confirmPassword) {
      setFormData({ ...formData, error: 'Passwords do not match' });
      return;
    }
    if (contactno.length !== 10) {
      setFormData({ ...formData, error: 'Contact number must be 10 digits long' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/auth/register', {
        username,
        email,
        password,
        address,
        contactno,
      });
      const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

      console.log('Registration successful:', response.data);
      navigate('/login'); // Navigate to login page after successful registration

    } catch (error) {
      console.error('Error registering user:', error);
      setFormData({ ...formData, error: 'Registration failed. Please try again later.' });
    }
  };

  return (
    <div className='register-container'>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label>Enter Username</label>
        <input type='text' name='username' value={username} onChange={handleChange} className='email' />
        
        <label>Enter Email</label>
        <input type='text' name='email' value={email} onChange={handleChange} className='email' required />
        
        <label>Enter Password</label>
        <input type='password' name='password' value={password} onChange={handleChange} className='email' required />
        
        <label>Confirm Password</label>
        <input type='password' name='confirmPassword' value={confirmPassword} onChange={handleChange} className='email' required />
        <label>Contact no</label>
        <input type='number' name='contactno' value={contactno} onChange={handleChange} className='email' required />
        
        <label>Address</label>
        <textarea name='address' value={address} onChange={handleChange} className='email' required />
        

        {error && <p className='error-message'>{error}</p>}

        <button type='submit' className='register-button'>
          Register
        </button>

        <h5>
          Already Create an Account <Link to='/login'>Login</Link>
        </h5>
      </form>
    </div>
  );
};

export default Register;
