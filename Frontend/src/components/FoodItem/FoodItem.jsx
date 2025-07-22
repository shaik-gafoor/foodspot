import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);

  // Add null check for cartItems
  const itemCount = (cartItems && cartItems[id]) || 0;

  console.log(
    `FoodItem ${name} - ID: ${id}, Count: ${itemCount}, CartItems:`,
    cartItems
  );

  const handleAdd = () => {
    console.log("Handle add clicked for ID:", id);
    if (addToCart) {
      addToCart(id);
    } else {
      console.error("addToCart function not available");
    }
  };

  const handleRemove = () => {
    console.log("Handle remove clicked for ID:", id);
    if (removeFromCart) {
      removeFromCart(id);
    } else {
      console.error("removeFromCart function not available");
    }
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={`${url}/images/${image}`}
          alt={name}
        />
        {itemCount === 0 ? (
          <img
            className="add"
            onClick={handleAdd}
            src={assets.add_icon_white}
            alt="Add item"
            style={{ cursor: "pointer" }}
          />
        ) : (
          <div className="food-item-count">
            <img
              onClick={handleRemove}
              src={assets.remove_icon_red}
              alt="Remove item"
              style={{ cursor: "pointer" }}
            />
            <p>{itemCount}</p>
            <img
              onClick={handleAdd}
              src={assets.add_icon_green}
              alt="Add more"
              style={{ cursor: "pointer" }}
            />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">₹{price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
