import React ,{useRef} from 'react';
import { Link } from 'react-router-dom';
import './Styling.css';

const Products = ({productRef}) => {

  return (
    <div>
      <div ref={productRef} id="product-categories">
        <div className='categories'>Product Category</div>
        <div className='product-container'>
          <div className='products-card'>
            <Link to="/cold-drink">
              <img src='./images/juices.jpg' alt='colddrinks' className='productimg' />
              <div className='product-info'>
                <h3>Cold Drinks and Juices</h3>
              </div>
            </Link>
          </div>
          <div className='products-card'>
            <Link to="/snacks">
              <img src='./images/snack.jpg' alt='snacks' className='productimg' />
              <div className='product-info'>
                <h3>Snacks</h3>
              </div>
            </Link>
          </div>
          <div className='products-card'>
            <Link to="/riceatta">
              <img src='./images/riceandatta.jpg' alt='Riceandatta' className='productimg' />
              <div className='product-info'>
                <h3>Rice and Atta</h3>
              </div>
            </Link>
          </div>
        </div>
        <div className='product-container'>
          <div className='products-card'>
            <Link to='/vegetables'>
              <img src='./images/fruits.jpg' alt='vegetables' className='productimg' />
              <div className='product-info'>
                <h3>Vegetables</h3>
              </div>
            </Link>
          </div>
          <div className='products-card'>
            <Link to='/dairymilk'>
              <img src='./images/dairyproducts.jpg' alt='dairy' className='productimg' />
              <div className='product-info'>
                <h3>Dairy and Bakery</h3>
              </div>
            </Link>
          </div>
          <div className='products-card'>
            <Link to='/masalaoil'>
              <img src='./images/masala.jpg' alt='masala and oil' className='productimg' />
              <div className='product-info'>
                <h3>Masala and Oil</h3>
              </div>
            </Link>
          </div>
          </div>
          <div className='product-container'>
          <div className='products-card'>
            <Link to='/fruits'>
              <img src='./images/fruit.jpg' alt='fruits' className='productimg' />
              <div className='product-info'>
                <h3>Fruits</h3>
              </div>
            </Link>
          </div>
          <div className='products-card'>
            <Link to='/ayurveda'>
              <img src='./images/ayurveda.jpg' alt='ayurveda' className='productimg' />
              <div className='product-info'>
                <h3>Ayurveda</h3>
              </div>
            </Link>
          </div>
          <div className='products-card'>
            <Link to='/meat'>
              <img src='./images/eggmeat.jpg' alt='meat' className='productimg' />
              <div className='product-info'>
                <h3>Meat</h3>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;