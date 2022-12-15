import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { serialize } from "object-to-formdata";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

import NewWaypoints from "../components/NewWaypoints";
import Loading from "../components/Loading";
import { postTour, verifyLogin } from "../api";
import * as api from "../api";
import { ipAdress } from "../api";

const AddTour = ({ id }) => {
  const [form, setForm] = useState({
    title: "",
    location: "",
    transportation: "",
    images: [],
    movingTime: "",
    totalTime: "",
    description: "",
    cost: "",
    viewpoints: {},
  });

  console.log(form);

  const [isLoaded, setIsLoaded] = useState(true);
  const imgInputRef = useRef(null);
  const username = useSelector((state) => state.users.username);
  const navigate = useNavigate();

  useEffect(() => {
    // const verify = async () => {
    //   await verifyLogin();
    //   setIsLoaded(true);
    // };
    // verify().catch((err) => {
    //   navigate("/users/login");
    // });

    if (id) {
      const doTask = async () => {
        const tour = await api.getSingleTour(id);
        tour.viewpoints.map((viewpoint) => ({ [viewpoint.id]: viewpoint }));

        setForm(tour);
      };

      doTask().catch((err) => console.log(err));
    }
  }, []);

  const handleImgs = (e) => {
    const images = e.target.files;
    const imgsArr = [];
    Object.values(images).forEach((img) => imgsArr.push(img));
    console.log(imgsArr);
    setForm({ ...form, images: imgsArr });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    console.log(form);
    const formData = serialize(form);
    // add User to the request
    if (!formData.get("createdBy")) {
      formData.append("createdBy", username);
    }

    try {
      if (id) {
        const response = await api.updateTour(form);
        console.log(response);
        console.log("successful update");
      } else {
        await postTour(formData);
        console.log("successful postForm");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleViewpoints = (e, id) => {
    setForm({
      ...form,
      viewpoints: {
        ...form.viewpoints,
        [id]: {
          ...form.viewpoints[id],
          [e.target.name]: e.target.value,
        },
      },
    });
  };

  const handleViewpointsImages = (e, id) => {
    const currentImages = e.target.files;
    let viewpointImagesArr = [];
    if (form.viewpoints[id]) {
      viewpointImagesArr = form.viewpoints[id]?.images;
      console.log(viewpointImagesArr);
      console.log("inside the if");
    }

    const arrCopy = [...viewpointImagesArr];
    const currentImagesArr = Object.values(currentImages);
    arrCopy.push(...currentImagesArr);
    setForm({
      ...form,
      viewpoints: {
        ...form.viewpoints,
        [id]: {
          ...form.viewpoints[id],
          images: arrCopy,
        },
      },
    });
  };

  const handleImages = (e) => {
    const images = e.target.files;
    const imgsArr = [...form.images];
    Object.values(images).forEach((img) => imgsArr.push(img));
    console.log(imgsArr);
    setForm({ ...form, images: imgsArr });
  };

  const clickImgInput = (e) => {
    e.preventDefault();
    imgInputRef.current?.click();
  };

  const closeOneImage = (index) => {
    const newArr = [...form.images];
    newArr.splice(index, 1);
    setForm({ ...form, images: newArr });
  };

  const closeOneViewpointImage = (id, index) => {
    const newArr = [...form.viewpoints[id].images];
    newArr.splice(index, 1);
    setForm({
      ...form,
      viewpoints: {
        ...form.viewpoints,
        [id]: {
          ...form.viewpoints[id],
          images: newArr,
        },
      },
    });
  };

  if (isLoaded) {
    return (
      <form className="add-tour" action="/multiple-upload" method="POST" encType="multipart/form-data" onSubmit={submitForm}>
        <div className="group">
          <textarea id="title" name="title" onChange={changeForm} value={form.title} required></textarea>
          <span className="bar"></span>
          <label htmlFor="title">Title</label>
        </div>
        <div className="group">
          <input id="location" type="text" name="location" onChange={changeForm} value={form.location} required />
          <span className="bar"></span>
          <label htmlFor="location">Location</label>
        </div>
        <div className="group">
          <select name="transportation" id="transportation" onChange={changeForm} value={form.transportation} required>
            <option disabled selected hidden></option>
            <option value="walking">Walking</option>
            <option value="public transportation">Public Transportation</option>
            <option value="car">Car</option>
            <option value="boat">Boat</option>
          </select>
          <span className="bar"></span>
          <label htmlFor="transportation">Choose Transportation</label>
        </div>
        <div className="group">
          <input id="movingTime" type="number" name="movingTime" onChange={changeForm} value={form.movingTime} required />
          <span className="bar"></span>
          <label htmlFor="movingTime">Moving Time</label>
        </div>
        <div className="group">
          <input id="totalTime" type="number" name="totalTime" onChange={changeForm} value={form.totalTime} required />
          <span className="bar"></span>
          <label htmlFor="totalTime">Total Time</label>
        </div>
        <div className="group">
          <textarea id="description" name="description" onChange={changeForm} value={form.description} required></textarea>
          <span className="bar"></span>
          <label htmlFor="description">Description</label>
        </div>
        <div className="group">
          <input id="cost" type="number" name="cost" onChange={changeForm} value={form.cost} required />
          <span className="bar"></span>
          <label htmlFor="cost">Cost (€)</label>
        </div>
        <div className="group group-imgs">
          {/* <input type="file" id="files123" title="yoo" multiple onChange={handleImgs} /> */}
          <input type="file" name="mainImgs" id="mainImgs" multiple onChange={handleImages} ref={imgInputRef} hidden={true} />
          <button className="btn btn-imgs" onClick={clickImgInput}>
            Add Images
          </button>
          <div className="imgs-container">
            {form.images.map((img, index) => {
              return (
                <div className="img-container" key={index}>
                  <img src={typeof img === "string" ? `${ipAdress}${img}` : URL.createObjectURL(img)} alt="" />
                  <CloseIcon className="icon" onClick={() => closeOneImage(index)} />
                </div>
              );
            })}
          </div>
        </div>
        <button type="submit">Submit</button>
        <NewWaypoints form={form} setForm={setForm} handleViewpoints={handleViewpoints} handleViewpointsImages={handleViewpointsImages} closeOneViewpointImage={closeOneViewpointImage} />
      </form>
    );
  } else {
    return <Loading />;
  }
};

export default AddTour;
