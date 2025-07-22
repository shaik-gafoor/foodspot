import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);

  const itemCount = (cartItems && cartItems[id]) || 0;

  const handleAdd = () => {
    if (addToCart) {
      addToCart(id);
    }
  };

  const handleRemove = () => {
    if (removeFromCart) {
      removeFromCart(id);
    }
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={`${url}/images/${image}`}
          alt={name}
          onError={(e) => {
            e.target.src = "/placeholder-food.jpg"; // Add fallback image
          }}
        />
        <div className="food-item-overlay">
          <div className="food-item-badge">
            <span className="badge-text">Tasty</span>
          </div>
        </div>

        {itemCount === 0 ? (
          <div className="add-btn-container">
            <button className="add-btn" onClick={handleAdd}>
              <img src={assets.add_icon_white} alt="Add item" />
            </button>
          </div>
        ) : (
          <div className="food-item-count">
            <button className="count-btn remove-btn" onClick={handleRemove}>
              <img src={assets.remove_icon_red} alt="Remove item" />
            </button>
            <span className="item-count">{itemCount}</span>
            <button className="count-btn add-btn-small" onClick={handleAdd}>
              <img src={assets.add_icon_green} alt="Add more" />
            </button>
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <h3 className="food-item-name">{name}</h3>
          <div className="rating-container">
            <img src={assets.rating_starts} alt="Rating" />
            <span className="rating-text">4.5</span>
          </div>
        </div>
        <p className="food-item-desc">{description}</p>
        <div className="food-item-footer">
          <p className="food-item-price">₹{price}</p>
          <span className="delivery-time">25-30 min</span>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
