import React, { useState, useContext, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './Styling.css';
import './background.css';
import { BsCartFill } from "react-icons/bs";
import { useCart } from './Searchcart';
import { AuthContext } from './authenticationstate'; // Adjust the path to your AuthContext file

const Navbars = ({ productRef }) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  const handleScrollToProducts = () => {
    if (productRef.current) {
      productRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const handleDropdownClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleDropdownClick);
    return () => {
      document.removeEventListener('mousedown', handleDropdownClick);
    };
  }, []);

  return (
    <div>
      <div className="container">
        <ul className="navbars">
          <div className="nav-items">
            <NavLink to="/" className ="freshmart">
            <img src="/images/mart.jpg" alt="groceryimg" className='logo' />
            </NavLink>
          </div>
          <div className='nav-links'>
            <li className="nav-item"><NavLink to="/">Home</NavLink></li>
            <li className="nav-item"><NavLink to="/about">About</NavLink></li>
            {user ? (
              <li
                className="nav-item"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <span className="account-text">Account</span>
                {showDropdown && (
                  <div className="dropdown-content" ref={dropdownRef}>
                    <NavLink to="/Vieworders">Your Orders</NavLink>
                    <span onClick={handleLogout}>Logout</span>
                  </div>
                )}
              </li>
            ) : (
              <li className="nav-item"><NavLink to="/login">Login</NavLink></li>
            )}
          </div>
        </ul>
        <div className='cart-icon'>
          <NavLink to={user ? "/mycart" : "/login"}>
            <BsCartFill size={37} color='black' />
          </NavLink>
          <span className="cart-count">{user ? cartItems.length : 0}</span>
        </div>
      </div>
      <form className='search' onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className='submitbutton' type="submit">Submit</button>
      </form>
      {location.pathname === '/' && (
        <div className='background-container'>
          <button className='shop' onClick={handleScrollToProducts}>Shop Now</button>
          <img src="/images/grocories.jpg" alt="img" className='background-image' />
        </div>
      )}
    </div>
  );
}

export default Navbars;
