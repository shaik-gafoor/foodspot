import React from "react";
import "./Add.css";
import { assets } from "../../assets/assets.js";
import { useState } from "react";

const Add = () => {
  const [image, setImage] = useState(false);

  return (
    <div className="add-container">
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

      <form className="add-form">
        <div className="form-group">
          <label htmlFor="product-name">Product name</label>
          <input
            type="text"
            id="product-name"
            placeholder="Type here"
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label htmlFor="product-description">Product description</label>
          <textarea
            id="product-description"
            placeholder="Write content here"
            rows="6"
            className="textarea-field"
          ></textarea>
        </div>

        <div className="form-group category-price">
          <div>
            <label htmlFor="product-category">Product category</label>
            <select id="product-category" className="input-field">
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
