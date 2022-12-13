import React, { useState, useEffect, useRef } from "react";

const NewWaypoint = ({ viewpointId, type, title, cost, images, form, setForm, description, handleViewpoints }) => {
  const [imgPreviews, setImgPreviews] = useState([]);
  const inputRef = useRef(null);

  console.log(form);

  useEffect(() => {
    if (images) {
      const imgPreviewsArr = [];
      for (let i = 0; i < images.length; i++) {
        const image = images.item(i);
        const reader = new FileReader();
        reader.onloadend = () => {
          imgPreviewsArr.push(reader.result);
          setImgPreviews(imgPreviewsArr);
        };
        reader.readAsDataURL(image);
      }
    } else {
      console.log("images object is empty");
    }
  }, [images]);

  const imgPreviewsUI = imgPreviews.map((img) => {
    return <img src={img} alt="" />;
  });

  //   const printSomething = () => {
  //     console.log("PRINT SOMETHING");
  //   };

  return (
    <div className="new-waypoint" key={viewpointId}>
      <div className="grid-container">
        <div className="imgs">
          <div className="grid-images">
            {imgPreviews.length > 0 ? (
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
            )}
          </div>
          <div className="group">
            <input className="input1" type="file" name="images" multiple onChange={(e) => handleViewpoints(e, viewpointId, "files")} ref={inputRef} />
          </div>
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
