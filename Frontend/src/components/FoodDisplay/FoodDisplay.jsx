import React, { useContext, useState } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../Context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const [search, setSearch] = useState("");

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {food_list
          .filter(
            (item) =>
              (category === "All" || category === item.category) &&
              item.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
              description={item.description}
            />
          ))}
      </div>
    </div>
  );
};

export default FoodDisplay;
