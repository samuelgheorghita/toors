import React, { useState, useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";

import { ipAdress } from "../api";

const NewWaypoint = ({ viewpointId, type, title, cost, images, form, setForm, description, handleViewpoints, handleViewpointsImages, closeOneViewpointImage }) => {
  const inputRef = useRef(null);

  console.log(form);

  const clickInput = (e) => {
    e.preventDefault();
    inputRef.current.click();
  };

  return (
    <div className="new-waypoint" key={viewpointId}>
      <div className="grid-container">
        <div className="imgs">
          <div className="grid-images">
            {/* {images.map((img, index) => {

            })
              imgPreviews.length > 0 ? (
              imgPreviewsUI
            ) : (
              <div
                className="insert-images"
                onClick={(e) => {
                  e.preventDefault();
                  inputRef.current.click();
                }}
              >
                Insert Images
              </div>
            )} */}
            {images.map((img, index) => {
              return (
                <div className="img-container">
                  <img src={typeof img === "string" ? `${ipAdress}${img}` : URL.createObjectURL(img)} alt="" />
                  <CloseIcon className="icon" onClick={() => closeOneViewpointImage(viewpointId, index)} />
                </div>
              );
            })}
          </div>
          <button className="btn" onClick={clickInput}>
            Add Images
          </button>
          <input className="input1" type="file" name="images" multiple onChange={(e) => handleViewpointsImages(e, viewpointId)} ref={inputRef} />
        </div>
        <div className="waypoint__form">
          <div className="group">
            <select name="type" id="type" value={type} onChange={(e) => handleViewpoints(e, viewpointId)} required>
              <option value="waypoint">Waypoint</option>
              <option value="monument">Monument</option>
              <option value="viewpoint">Viewpoint</option>
              <option value="garden">Garden</option>
              <option value="restaurant">Restaurant</option>
            </select>
            <span className="bar"></span>
            <label htmlFor="type">Type</label>
          </div>
          <div className="group">
            <input id="title" type="text" name="title" value={title} onChange={(e) => handleViewpoints(e, viewpointId)} required />
            <span className="bar"></span>
            <label htmlFor="title">Title</label>
          </div>
          <div className="group">
            <textarea id="description" name="description" value={description} onChange={(e) => handleViewpoints(e, viewpointId)} required></textarea>
            <span className="bar"></span>
            <label htmlFor="description">Description</label>
          </div>
          <div className="group">
            <input id="cost" type="number" name="cost" value={cost} onChange={(e) => handleViewpoints(e, viewpointId)} required />
            <span className="bar"></span>
            <label htmlFor="totalTime">Cost (€)</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewWaypoint;
