import React, { useContext, useState } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../Context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const [search, setSearch] = useState("");

  const filteredFoodList = food_list.filter(
    (item) =>
      (category === "All" || category === item.category) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="food-display" id="food-display">
      <div className="food-display-header">
        <div className="header-content">
          <h2 className="food-display-title">Top dishes near you</h2>
          <p className="food-display-subtitle">
            Discover delicious meals from local restaurants
          </p>
        </div>

        <div className="search-container">
          <div className="search-input-wrapper">
            <svg
              className="search-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button onClick={() => setSearch("")} className="clear-search">
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="food-display-info">
        <div className="category-info">
          <span className="category-label">
            {category === "All" ? "All Categories" : category}
          </span>
          <span className="items-count">
            {filteredFoodList.length} items found
          </span>
        </div>
      </div>

      {filteredFoodList.length === 0 ? (
        <div className="no-results">
          <div className="no-results-content">
            <div className="no-results-icon">🍽️</div>
            <h3>No dishes found</h3>
            <p>Try adjusting your search or browse different categories</p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="clear-search-btn"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="food-display-list">
          {filteredFoodList.map((item, index) => (
            <div
              key={item._id}
              className="food-item-wrapper"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <FoodItem
                id={item._id}
                name={item.name}
                image={item.image}
                price={item.price}
                description={item.description}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;
