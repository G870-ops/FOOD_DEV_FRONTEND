import { useState, useContext } from 'react';
import './FoodItem.css';
import { assets, food_list } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
  
  // State to toggle currency on click
  const [showInr, setShowInr] = useState(false);
  const USD_TO_INR = 95.08; // Conversion rate

  // State for 3D inspection modal/tilt
  const [isRotating3D, setIsRotating3D] = useState(false);

  // Extract food number from filename like "1786731199796food_21.png" → 21
  const getFoodIndexFromFilename = (imgName) => {
    if (!imgName) return null;
    const match = imgName.match(/food_(\d+)\.png/i);
    return match ? parseInt(match[1], 10) : null;
  };

  // Get static local fallback image using the food index encoded in the filename
  const getFallbackImage = (imgName) => {
    const idx = getFoodIndexFromFilename(imgName);
    if (idx !== null && idx >= 1 && idx <= food_list.length) {
      return food_list[idx - 1].image;
    }
    // Last-resort: fuzzy name match (trim + normalize whitespace)
    const normName = name.trim().replace(/\s+/g, ' ').toLowerCase();
    const staticItem = food_list.find(
      (item) => item.name.trim().replace(/\s+/g, ' ').toLowerCase() === normName
    );
    return staticItem ? staticItem.image : assets.header_img;
  };

  // Build the image src — always use the static local asset directly
  // since Vercel does not persist uploaded files and all /images/ requests 404.
  const getImageUrl = (imgName) => {
    if (!imgName) return getFallbackImage(imgName);
    // If it's already an absolute URL (not a Vercel backend image path), use it
    if (imgName.startsWith('http://') || imgName.startsWith('https://')) {
      return imgName;
    }
    // imgName is a filename like "1786731199796food_21.png"
    // Try to resolve via static assets first (avoids Vercel 404 entirely)
    const staticImg = getFallbackImage(imgName);
    if (staticImg) return staticImg;
    // Fallback to backend URL (for locally-running backend)
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
            e.target.src = getFallbackImage(image);
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
                  e.target.src = getFallbackImage(image);
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