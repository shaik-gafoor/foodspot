import React, { useEffect } from "react";
import "./Add.css";
import { assets } from "../../assets/assets.js";
import { useState } from "react";
import axios from "axios";

const Add = () => {
  const url = "http://localhost:4000";
  const [image, setImage] = useState(false);
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

  //API call
  const onSubmitHandler = async (event) => {
    event.preventDefault();
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
    } else {
    }
  };

  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  return (
    <div className="add-container">
      <form className="add-form" onSubmit={onSubmitHandler}>
        <h2 className="upload-title">Upload Image</h2>
        <div className="upload-section">
          <label htmlFor="image-upload">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Upload"
              className="upload-icon"
            />
            <p>Upload</p>
          </label>
          <input
            type="file"
            id="image-upload"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
            hidden
          />
        </div>

        {/* <form className="add-form"> */}
        <div className="form-group">
          <label htmlFor="product-name">Product name</label>
          <input
            name="name"
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            id="product-name"
            placeholder="Type here"
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label htmlFor="product-description">Product description</label>
          <textarea
            name="description"
            onChange={onChangeHandler}
            value={data.description}
            id="product-description"
            placeholder="Write content here"
            rows="6"
            className="textarea-field"
          ></textarea>
        </div>

        <div className="form-group category-price">
          <div>
            <label htmlFor="product-category">Product category</label>
            <select
              name="category"
              onChange={onChangeHandler}
              id="product-category"
              className="input-field"
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
          <div>
            <label htmlFor="product-price">Product price</label>
            <input
              name="price"
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              id="product-price"
              placeholder="$20"
              className="input-field"
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;
