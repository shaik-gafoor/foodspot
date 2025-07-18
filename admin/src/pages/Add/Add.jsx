import React, { useEffect, useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets.js";
import axios from "axios";
import { toast } from "react-toastify";

const Add = ({ url }) => {
  const [image, setImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
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

  // API call
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));
      formData.append("category", data.category);
      formData.append("image", image);

      const response = await axios.post(`${url}/api/food/add`, formData);

      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Salad",
        });
        setImage(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`add-page ${sidebarCollapsed ? "sidebar-collapsed" : ""} ${
        isMobile ? "mobile-view" : ""
      }`}
    >
      <div className="add-container">
        <h1 className="page-title">Add New Food Item</h1>

        <form className="add-form" onSubmit={onSubmitHandler}>
          {/* Image Upload Section */}
          <div className="upload-section">
            <h3 className="section-title">Upload Image</h3>
            <label htmlFor="image-upload" className="upload-area">
              <img
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt="Upload"
                className="upload-preview"
              />
              <div className="upload-text">
                <p>{image ? "Change Image" : "Click to Upload"}</p>
                <span>PNG, JPG, GIF up to 10MB</span>
              </div>
            </label>
            <input
              type="file"
              id="image-upload"
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
              hidden
              required
            />
          </div>

          {/* Form Fields */}
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="product-name">Product Name</label>
              <input
                name="name"
                onChange={onChangeHandler}
                value={data.name}
                type="text"
                id="product-name"
                placeholder="Enter product name"
                className="input-field"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="product-description">Product Description</label>
              <textarea
                name="description"
                onChange={onChangeHandler}
                value={data.description}
                id="product-description"
                placeholder="Write a detailed description"
                rows="4"
                className="textarea-field"
                required
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="product-category">Category</label>
                <select
                  name="category"
                  onChange={onChangeHandler}
                  value={data.category}
                  id="product-category"
                  className="select-field"
                >
                  <option value="Salad">Salad</option>
                  <option value="Rolls">Rolls</option>
                  <option value="Desert">Desert</option>
                  <option value="Sandwich">Sandwich</option>
                  <option value="Cake">Cake</option>
                  <option value="Pure veg">Pure veg</option>
                  <option value="Pasta">Pasta</option>
                  <option value="Noodles">Noodles</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="product-price">Price</label>
                <input
                  name="price"
                  onChange={onChangeHandler}
                  value={data.price}
                  type="number"
                  id="product-price"
                  placeholder="0.00"
                  className="input-field"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={`submit-btn ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Adding...
                </>
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;
