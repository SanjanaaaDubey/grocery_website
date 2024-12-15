import React, { useState, useContext } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import { login } from './auth'; 
import { AuthContext } from './authenticationstate'; // Ensure correct import

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext); // Assuming AuthContext provides setUser

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      
      const { token, admin,user } = response.data;
      if (!token || admin === undefined) {
        throw new Error('Token or role data missing in response');
      }
  
      // Store data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('isAdmin', admin.toString()); // Store as string
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('username', user.username);
  
      // Update context with user data
      setUser({ email, role: admin ? 'admin' : 'user' });
  
      setError('');
  
      // Redirect based on role
      if (admin) {
        navigate('/admin'); // Redirect to admin page
      } else {
        navigate('/'); // Redirect to homepage or dashboard
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      setError('Invalid credentials.Please Register.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='login-container'>
      <h2>Login</h2>
      {error && <p className='error'>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email Address:</label>
        <input
          type='email'
          name='email'
          value={email}
          className='text-design'
          placeholder='Enter email'
          onChange={handleInputChange}
          required
        />
        <label>Password:</label>
        <input
          type='password'
          name='password'
          value={password}
          className='text-design'
          placeholder='Enter password'
          onChange={handleInputChange}
          required
        />
        <button type='submit' className='submit-button' disabled={loading}>
          {loading ? 'Logging in...' : 'Submit'}
        </button>
        <div className='signup'>
          <h5>New here? <Link to='/register'>Create an account</Link></h5>
        </div>
      </form>
    </div>
  );
};
export default Login;