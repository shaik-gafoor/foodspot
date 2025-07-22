import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  // Detect sidebar state changes
  useEffect(() => {
    const detectSidebarState = () => {
      // Method 1: Check for collapsed sidebar class
      const sidebar = document.querySelector('.sidebar, [class*="sidebar"]');
      if (sidebar) {
        const isCollapsed =
          sidebar.classList.contains("collapsed") ||
          sidebar.classList.contains("minimized") ||
          sidebar.offsetWidth < 150;
        setSidebarCollapsed(isCollapsed);
      }
    };

    // Initial detection
    detectSidebarState();

    // Create mutation observer to watch for sidebar changes
    const observer = new MutationObserver(() => {
      setTimeout(detectSidebarState, 50); // Small delay to ensure DOM updates
    });

    // Observe changes to the body and sidebar
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    // Listen for window resize
    window.addEventListener("resize", detectSidebarState);

    // Listen for custom sidebar toggle events (if your app dispatches them)
    const handleSidebarToggle = () => {
      setTimeout(detectSidebarState, 100);
    };

    document.addEventListener("sidebarToggle", handleSidebarToggle);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", detectSidebarState);
      document.removeEventListener("sidebarToggle", handleSidebarToggle);
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
    <div className={`list-page ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
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
