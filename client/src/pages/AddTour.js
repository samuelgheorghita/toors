import React, { useState } from "react";
import axios from "axios";
import { serialize } from "object-to-formdata";

import NewWaypoints from "../components/NewWaypoints";

const AddTour = () => {
  const [form, setForm] = useState({
    title: "",
    location: "",
    transportation: "",
    images: {},
    movingTime: "",
    totalTime: "",
    description: "",
    viewpoints: {},
  });

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

  const handleImages = (e) => {
    const images = e.target.files;
    // TODO: change this object into an array. It will be way easier to work with

    // the "ind = -1" is just a property to know in the backend that this is the main description
    for (let i = 0; i < images.length; i++) {
      const elem = images[i];
      console.log(elem);
      elem.ind = "-1";
    }
    console.log(images);

    setForm({ ...form, images: images });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    console.log(form.images);

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
    for (let i = 0; i < form.images.length; i++) {
      const file = form.images[i];
      formData.append("files", file);
    }
    formData.delete("images");

    // for (let pair of formData.entries()) {
    //   console.log(`${pair[0]}: ${pair[1]}`);
    // }

    const newFormData = serialize(form);
    console.log("Printing NEWFORMDATA");
    for (let pair of newFormData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const response = await axios.post("http://localhost:5000/tours/multiple", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("successful postForm");
    } catch (error) {
      console.log(error);
    }
  };

  var objectToFormData = function (obj, form, namespace) {
    var fd = form || new FormData();
    var formKey;

    for (var property in obj) {
      if (obj.hasOwnProperty(property)) {
        if (namespace) {
          formKey = namespace + "[" + property + "]";
        } else {
          formKey = property;
        }

        // if the property is an object, but not a File,
        // use recursivity.
        if (typeof obj[property] === "object" && !(obj[property] instanceof File)) {
          objectToFormData(obj[property], fd, property);
        } else {
          // if it's a string or a File object
          fd.append(formKey, obj[property]);
        }
      }
    }

    return fd;
  };

  // const submitForm = async (e) => {
  //   e.preventDefault();
  //   console.log(form.images);

  //   const formData = new FormData();
  //   for (const key in form) {
  //     formData.append(key, form[key]);
  //   }
  //   for (let i = 0; i < form.images.length; i++) {
  //     const file = form.images[i];
  //     formData.append("files", file);
  //   }
  //   formData.delete("images");

  //   try {
  //     const response = await axios.post("http://localhost:5000/tours/multiple", formData);
  //     console.log("successful postForm");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <form className="add-tour" action="/multiple-upload" method="POST" encType="multipart/form-data" onSubmit={submitForm}>
      <div className="group">
        <input id="title" type="text" name="title" onChange={changeForm} value={form.title} required />
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
        <input id="movingTime" type="text" name="movingTime" onChange={changeForm} value={form.movingTime} required />
        <span className="bar"></span>
        <label htmlFor="movingTime">Moving Time</label>
      </div>
      <div className="group">
        <input id="totalTime" type="text" name="totalTime" onChange={changeForm} value={form.totalTime} required />
        <span className="bar"></span>
        <label htmlFor="totalTime">Total Time</label>
      </div>
      <div className="group">
        <textarea id="description" name="description" onChange={changeForm} value={form.description} required></textarea>
        <span className="bar"></span>
        <label htmlFor="description">Description</label>
      </div>
      <div className="group">
        <input type="file" multiple onChange={handleImages} />
      </div>
      <button type="submit">Submit</button>
      <NewWaypoints form={form} setForm={setForm} handleViewpoints={handleViewpoints} />
    </form>
  );
};

export default AddTour;
