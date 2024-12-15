import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminpage.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faBars } from '@fortawesome/free-solid-svg-icons'; 

const AdminPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Dashboard');
  const [data, setData] = useState(null);
  const [products, setProducts] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('http://localhost:4000/api/admin/admin', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      if (response.status === 200) {
        console.log('Token verified:', response.data);
        if (selectedCategory === 'Dashboard') {
          fetchOrders();
        } else if (selectedCategory === 'Products') {
          fetchProducts();
        }
      } else {
        navigate('/login');
      }
    }).catch(() => {
      navigate('/login');
    });
  }, [navigate, selectedCategory]);

  useEffect(() => {
    if (selectedCategory === 'Dashboard') {
      fetchOrders();
    } else if (selectedCategory === 'Registered Users') {
      fetchUsers();
    } else if (selectedCategory === 'Products') {
      fetchProducts();
    }
  }, [selectedCategory]);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:4000/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:4000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:4000/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleUpdate = (product) => {
    setCurrentProduct(product);
    setNewName(product.name);
    setNewPrice(product.price);
    setModalVisible(true);
  };

  const handleUpdateConfirm = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:4000/api/admin/products/${currentProduct._id}`, {
        name: newName,
        price: newPrice
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Update the product in the state
      setProducts(products.map(product => 
        product._id === currentProduct._id ? { ...product, name: newName, price: newPrice } : product
      ));
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleDelete = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:4000/api/admin/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProducts(products.filter(product => product._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="admin-page">
      <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <FontAwesomeIcon 
          icon={faBars} 
          className={`toggle-button ${isSidebarCollapsed ? 'collapsed' : ''}`} 
          onClick={toggleSidebar} 
        />
        <h2>FreshMart</h2>
        <ul className={isSidebarCollapsed ? 'hidden' : ''}>
          <li onClick={() => handleCategoryClick('Dashboard')}>Dashboard</li>
          <li onClick={() => handleCategoryClick('Registered Users')}>Registered Users</li>
          <li onClick={() => handleCategoryClick('Products')}>Products</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>
      <div className={`content ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <h1>Admin Panel</h1>
        <h2>{selectedCategory}</h2>
        {selectedCategory === 'Dashboard' && data && (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Card Name</th>
                <th>Order Date</th>
                <th>Delivery Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.cardName}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>{order.deliveryStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {selectedCategory === 'Registered Users' && data && (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Contact No</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.contactno}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {selectedCategory === 'Products' && products && (
          <div className="product-cards">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>Price: ${product.price}</p>
                <button onClick={() => handleUpdate(product)}>Update</button>
                <button onClick={() => handleDelete(product._id)}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h3>Update Product</h3>
            <label>
              Name:
              <input 
                type="text" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
              />
            </label>
            <label>
              Price:
              <input 
                type="number" 
                value={newPrice} 
                onChange={(e) => setNewPrice(e.target.value)} 
              />
            </label>
            <button onClick={handleUpdateConfirm}>Update</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;