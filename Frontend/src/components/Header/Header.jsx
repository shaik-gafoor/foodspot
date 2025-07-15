import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div>
      <div className="header">
        <div className="header-contents">
          <h2>FOODSPOT</h2>
          <p>
            Bringing your cravings to your doorstep — fast, fresh, and
            flavorful. Discover a world of delicious meals at your fingertips.
            Your hunger, our mission. Order now and taste the convenience!
          </p>
          <button className="button">View Menu</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
