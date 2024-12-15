import React,{Component} from 'react';
import './Styling.css';
import {Link} from 'react-router-dom';
class Footer extends Component {
    state = {  } 
    render() { 
        return (
            <div className='footer-container'>
                <div className='about-container'>
                <h3>About</h3>
                <p className='list-container'>this is an amazing website</p>
                </div>
                <div className ='about-container'>
                    <h3>Categories</h3>
                    <ul className='list-container'>
                    <li className='productsname'><Link to ="/cold-drink">Cold Drink and Juices</Link></li>
                    <li className='productsname'><Link to ="/riceatta">Rice and Atta</Link></li>
                    <li className='productsname'><Link to="/vegetables">Vegetables and Fruits</Link></li>
                    <li className='productsname'><Link to= '/masalaoil'>Masala and Oil</Link></li>
                    <li className='productsname'><Link to='/snacks'>Snacks</Link></li>
                    <li className='productsname'><Link to='/dairymilk'>Dairy and bakery</Link></li>
                    <li className='productsname'><Link to='/fruits'>Fruits</Link></li>
                    <li className='productsname'><Link to='/meat'>Meat</Link></li>
                    <li className='productsname'><Link to='/ayurveda'>Ayurveda</Link></li>
                    </ul>

                </div>
                <div className='about-container'>
                    <h3>Links</h3>
                    <ul className='list-container'>
                    <li className='productsname'><a href='https://www.facebook.com/'>FaceBook</a></li>
                    <li className='productsname'><a href='https://www.linkedin.com/'>Linkedin</a></li>
                    <li className='productsname'><a href= 'https://www.instagram.com/'>Instagram</a></li>
                    </ul>
                </div>
            </div>

        );
    }
}
 
export default Footer;