
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt=""/>
          
          <p>Food delivery is simply the art of bringing culinary passion straight to your doorstep. From local neighborhood kitchens to gourmet dining, delivery services have connected hungry food lovers with freshly prepared meals ever since the rise of modern hospitality, when visionary chefs and couriers transformed how the world enjoys dining at home.</p> 
          <div className="footer-social-icons">
            <a href="https://www.facebook.com/profile.php?id=100073284108773" target="_blank" rel="noopener noreferrer" title="Facebook">
              <img src={assets.facebook_icon || ""} alt="Facebook" /> 
            </a>
            <a href="https://x.com/GOUTAMGUPT40158" target="_blank" rel="noopener noreferrer" title="Twitter">
              <img src={assets.twitter_icon || ""} alt="Instagram" />
            </a>
            <a href="https://linkedin.com/in/goutam-gupta-0b8422279" target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <img src={assets.linkedin_icon || ""} alt="LinkedIn" />
            </a>
          </div>
        </div>

        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          
          <ul>
            <li>+91-8343957187</li>
            <li>goutamgupta604@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      
      <p className="footer-copyright">Copyright 2026 Inspirational.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer