import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error");
      }
    } catch (err) {
      toast.error("Network Error");
    }
  };

  // Check screen size and sidebar state
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    const handleSidebarToggle = (event) => {
      setSidebarCollapsed(event.detail.collapsed);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    window.addEventListener("sidebarToggle", handleSidebarToggle);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      window.removeEventListener("sidebarToggle", handleSidebarToggle);
    };
  }, []);

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div
      className={`list-page ${sidebarCollapsed ? "sidebar-collapsed" : ""} ${
        isMobile ? "mobile-view" : ""
      }`}
    >
      <p className="list-title">All Foods List</p>
      <div className="list-table-container">
        <div className="list-table">
          <div className="list-table-format list-table-header">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Action</b>
          </div>
          {list.map((item, index) => (
            <div key={index} className="list-table-format">
              <img src={`${url}/images/${item.image}`} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p onClick={() => removeFood(item._id)} className="delete-btn">
                ✕
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default List;
