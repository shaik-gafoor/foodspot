import React from "react";
import "./Home.css";
import { useState } from "react";
import Menu from "../../components/ExploreMenu/Menu.jsx";
import Header from "../../components/Header/Header.jsx";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay.jsx";

const Home = () => {
  const [category, setCategory] = useState("All");
  return (
    <div>
      <Header />
      <Menu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
    </div>
  );
};

export default Home;
