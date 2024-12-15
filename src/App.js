import React, { useRef } from 'react';
import './App.css';
import { Route, Routes,useLocation  } from 'react-router-dom';
import Navbars from './components/Navbars';
import Products from './components/Products';
import Colddrink from './components/Colddrink';
import Snacks from './components/Snacks';
import Riceatta from './components/Riceatta';
import Dairyproduct from './components/Dairyproduct';
import Masala from './components/Masala';
import Vegetable from './components/Vegetable';
import Fruits from './components/Fruits';
import Ayurveda from './components/Ayurveda';
import Meat from './components/Meat';
import Search from './components/Search';
import './components/fruits.css';
import Login from './components/Login';
import Register from './components/Register';
import OrderSuccess from './components/OrderSuccess';
import Vieworders from './components/Vieworders';
import Orders from './components/Orders';
import './components/dairyproduct.css';
import './components/colddrink.css';
import './components/snacks.css';
import './components/riceatta.css';
import './components/masala.css';
import './components/vegetable.css';
import './components/ayurveda.css';
import './components/meat.css';
import './components/login.css';
import Footer from './components/Footer';
import Item from './components/Item';
import './components/background.css';
import './components/Styling.css';
import './components/register.css';
import './components/items.css';
import './components/cartdesign.css';
import About from './components/About';
import Mycart from './components/Mycart';
import Productcart from './components/Productcart';
import { CartProvider } from './components/Searchcart';
import AuthProvider from './components/authenticationstate';
import AdminPage from './components/Adminpage';

function App() {
  const productRef = useRef(null);
  const location = useLocation(); // Get the current route location

  // Determine if the current route is '/admin'
  const isAdminPage = location.pathname === '/admin';

  return (
    <AuthProvider>
      <CartProvider>
        <div className='App'>
        {!isAdminPage && <Navbars productRef={productRef} />}
          <Routes>
            <Route path="/" element={<Products productRef={productRef} />} />
            <Route path="/cold-drink" element={<Colddrink />} />
            <Route path="/snacks" element={<Snacks />} />
            <Route path="/riceatta" element={<Riceatta />} />
            <Route path="/dairymilk" element={<Dairyproduct />} />
            <Route path="/masalaoil" element={<Masala />} />
            <Route path="/vegetables" element={<Vegetable />} />
            <Route path="/fruits" element={<Fruits />} />
            <Route path="/ayurveda" element={<Ayurveda />} />
            <Route path="/meat" element={<Meat />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<Search />} />
            <Route path="/item" element={<Item />} />
            <Route path="/about" element={<About />}/>
            <Route path="/mycart" element={<Mycart />} />
            <Route path="/productcart" element={<Productcart />} /> 
            <Route path="/ordersuccess" element={<OrderSuccess />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/vieworders" element={<Vieworders/>} />
            <Route path="/admin" element={<AdminPage />} /> 
            </Routes>
            {!isAdminPage && <Footer />}
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
