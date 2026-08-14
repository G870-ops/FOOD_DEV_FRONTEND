import { useState, useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
  
  // State to toggle currency on click
  const [showInr, setShowInr] = useState(false);
  const USD_TO_INR = 95.08; // Conversion rate

  // State for 3D inspection modal/tilt
  const [isRotating3D, setIsRotating3D] = useState(false);

  // Determine correct image URL logic with fallbacks
  const getImageUrl = (imgName) => {
    if (!imgName) return ; // fallback asset
    if (imgName.startsWith("http://") || imgName.startsWith("https://")) {
      return imgName;
    }
    return `${url}/images/${imgName}`;
  };

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img 
          className='food-item-image' 
          src={getImageUrl(image)} 
          alt={name} 
          onError={(e) => {
            // Fallback image if backend image URL fails to load
            e.target.onerror = null; 
            e.target.src = assets.header_img || "https://placehold.co/300x200?text=Food+Image";
          }}
        />
        
        {/* Interactive 3D Preview Button Badge */}
        <button 
          className="inspect-3d-btn" 
          onClick={() => setIsRotating3D(!isRotating3D)}
        >
          {isRotating3D ? "✨ Exit 3D" : "🔄 3D View"}
        </button>
        
        {/* Conditional Interactive 3D Card Simulation Overlay */}
        {isRotating3D && (
          <div className="interactive-3d-viewer">
            <div className="rotating-dish-model">
              <img 
                src={getImageUrl(image)} 
                alt="3D preview" 
                className="ring-spin" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = assets.header_img || "https://placehold.co/300x200?text=Food+Image";
                }}
              />
              <p></p>
            </div>
          </div>
        )}

        {!cartItems[id] ? (
          <img 
            className='add' 
            onClick={() => addToCart(id)} 
            src={assets.add_icon_white} 
            alt="Add" 
          />
        ) : (
          <div className='food-item-counter'>
            <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="Remove" />
            <p>{cartItems[id]}</p>
            <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="Add" />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="food-item-desc">{description}</p>
        
        {/* Interactive Currency Toggle */}
        <p 
          className="food-item-price clickable-price" 
          onClick={() => setShowInr(!showInr)}
          title="Click to switch between USD and INR"
        >
          {showInr ? `₹${(price * USD_TO_INR).toFixed(2)}` : `$${price}`}
        </p>
      </div>
    </div>
  );
};

export default FoodItem;