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

  // Resolution logic strictly targeting the 32 food assets or uploaded backend image
  const getFoodImage = () => {
    // 1. Direct ID match from local assets list (1-32)
    const matchedById = food_list.find((item) => String(item._id) === String(id));
    if (matchedById) return matchedById.image;

    // 2. Direct string filename match (e.g. "food_1.png")
    if (typeof image === 'string') {
      const matchedByName = food_list.find(
        (item) => typeof item.image === 'string' && item.image.includes(image)
      );
      if (matchedByName) return matchedByName.image;

      // 3. Absolute URL or blob link
      if (image.startsWith("data:") || image.startsWith("http://") || image.startsWith("https://")) {
        return image;
      }
    }

    // 4. Fallback to backend server image upload path
    return `${url}/images/${image}`;
  };

  const currentImageSrc = getFoodImage();

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img 
          className='food-item-image' 
          src={currentImageSrc} 
          alt={name} 
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
              <img src={currentImageSrc} alt="3D preview" className="ring-spin" />
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