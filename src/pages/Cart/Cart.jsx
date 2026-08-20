import { useContext } from 'react' 
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';
import { food_list as staticFoodList } from '../../assets/assets';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
  const navigate = useNavigate();

  // Resolve the correct image for a food item:
  // The uploaded filename encodes the food index, e.g. "1786731199796food_21.png" → food_21
  // This avoids all Vercel /images/ 404s.
  const getFoodImage = (item) => {
    const imgName = item.image || '';
    if (imgName.startsWith('http://') || imgName.startsWith('https://')) return imgName;
    const match = imgName.match(/food_(\d+)\.png/i);
    if (match) {
      const idx = parseInt(match[1], 10);
      if (idx >= 1 && idx <= staticFoodList.length) return staticFoodList[idx - 1].image;
    }
    // Fuzzy name fallback
    const norm = (s) => s.trim().replace(/\s+/g, ' ').toLowerCase();
    const found = staticFoodList.find((s) => norm(s.name) === norm(item.name));
    return found ? found.image : `${url}/images/${imgName}`;
  };

  const getSubtotal = () => {
    if (typeof getTotalCartAmount === 'function') {
      return getTotalCartAmount();
    }
    if (!cartItems || !food_list) return 0;
    let total = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          total += itemInfo.price * cartItems[item];
        }
      }
    }
    return total;
  };

  const subtotal = getSubtotal();
  
  // Conversion logic
  const USD_TO_INR = 95.08; 
  const totalUSD = subtotal === 0 ? 0 : subtotal + 2;
  const totalINR = totalUSD * USD_TO_INR;

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list && food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id || index}>
                <div className='cart-items-title cart-items-item'>
                  <img src={getFoodImage(item)} alt={item.name} />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>${item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                </div>
                <hr />
              </div>
            )
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${subtotal} <span className="inr-subtext">(₹{(subtotal * USD_TO_INR).toFixed(2)})</span></p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${subtotal === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${totalUSD} <span className="inr-subtext">(₹{totalINR.toFixed(2)})</span></b>
            </div>
          </div>
          {/* 👈 Added onClick navigation handler here */}
          <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder='promo code' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart;