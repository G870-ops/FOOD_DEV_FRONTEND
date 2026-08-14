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

  // Determine correct image URL logic with comprehensive fallbacks
  const getImageUrl = (imgName) => {
    // 1. Fallback if no image prop provided
    if (!imgName) return assets.header_img;

    // 2. If imgName is ALREADY a local imported asset module/object or path
    if (typeof imgName !== 'string') {
      return imgName;
    }

    // 3. If image is an external URL (e.g., Cloudinary, S3, http/https)
    if (imgName.startsWith("http://") || imgName.startsWith("https://")) {
      return imgName;
    }

    // 4. Clean extension if checking keys (e.g., "food_1.png" -> "food_1")
    const cleanKey = imgName.replace(/\.[^/.]+$/, "");

    // 5. If matching key exists in exported assets object
    if (assets[imgName]) return assets[imgName];
    if (assets[cleanKey]) return assets[cleanKey];

    // 6. Express Backend static file URL
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
            // Fallback image if both primary and secondary image URLs fail
            e.target.onerror = null; 
            e.target.src = "https://placehold.co/300x200?text=Food+Image";
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
                  e.target.src = "https://placehold.co/300x200?text=Food+Image";
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