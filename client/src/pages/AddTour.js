import React, { useEffect, useState } from "react";
import axios from "axios";
import { serialize } from "object-to-formdata";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import NewWaypoints from "../components/NewWaypoints";
import { postTour, verifyLogin } from "../api";
import Loading from "../components/Loading";

const AddTour = () => {
  const [form, setForm] = useState({
    title: "",
    location: "",
    transportation: "",
    images: {},
    movingTime: "",
    totalTime: "",
    description: "",
    cost: "",
    viewpoints: {},
  });

  const [isLoaded, setIsLoaded] = useState(true);
  const username = useSelector((state) => state.users.username);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      await verifyLogin();
      setIsLoaded(true);
    };

    verify().catch((err) => {
      navigate("/users/login");
    });
  }, []);

  const handleImages = (e) => {
    const images = e.target.files;
    setForm({ ...form, images: images });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const formData = serialize(form);
    // add User to the request
    formData.append("createdBy", username);

    try {
      await postTour(formData);
      console.log("successful postForm");
    } catch (error) {
      console.log(error);
    }
  };

  const changeForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleViewpoints = (e, id, type = "value") => {
    setForm({
      ...form,
      viewpoints: {
        ...form.viewpoints,
        [id]: {
          ...form.viewpoints[id],
          [e.target.name]: e.target[type],
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
        <div className="group">
          <input type="file" id="files123" title="yoo" multiple onChange={handleImages} />
          {/* <button className="btn"></button> */}
        </div>
        <button type="submit">Submit</button>
        <NewWaypoints form={form} setForm={setForm} handleViewpoints={handleViewpoints} />
      </form>
    );
  } else {
    return <Loading />;
  }
};

export default AddTour;
