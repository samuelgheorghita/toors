import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Link } from "react-router-dom";

import { getUserByUsername } from "../../api";
import { changeAbout, changeEmail, changeName, changeProfileImg } from "../../apis/account-settings/personalInfoApi";
import Loading from "../../components/Loading";
import NoPhotoAvailable from "../../images/no-photo-available.png";
import { baseURL } from "../../apis/globalApi";

const ButtonSave = () => {
  return (
    <>
      <button type="submit" className="button-save">
        Save
      </button>
    </>
  );
};

const PersonalInfo = () => {
  const [form, setForm] = useState({
    name: {
      isOn: false,
      firstName: "",
      lastName: "",
    },
    email: { isOn: false, email: "" },
    about: { isOn: false, about: "" },
    profileImg: "",
  });
  const [imgPreview, setImgPreview] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const username = useSelector((state) => state.users.username);
  const inputImgRef = useRef(null);

  useEffect(() => {
    fetchUser().catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const img = form.profileImg;

    if (img) {
      if (typeof img == "string") {
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setImgPreview(reader.result);
        };
        reader.readAsDataURL(img);
      }
    }
  }, [form.profileImg]);

  const fetchUser = async () => {
    const user = await getUserByUsername(username);
    setForm({
      name: { ...form.name, firstName: user.firstName, lastName: user.lastName },
      email: { ...form.email, email: user.email },
      about: { ...form.about, about: user?.about },
      // profileImg: user?.profileImg,
    });
    setUser(user);
    setIsLoaded(true);
  };

  const submitForm = async (e, apiFunction) => {
    e.preventDefault();
    console.log("submitting a form");
    const formData = new FormData(e.target);
    const readyObj = Object.fromEntries(formData.entries());

    try {
      const response = await apiFunction(readyObj);
      console.log(response);
      await fetchUser();
    } catch (error) {
      console.log(error);
    }
  };

  const changeFormIsOn = (property) => {
    setForm({ ...form, [property]: { ...form[property], isOn: !form[property].isOn } });
  };

  const changeFormProperty = (e, property) => {
    setForm({ ...form, [property]: { ...form[property], [e.target.name]: e.target.value } });
  };

  const handleImage = (e) => {
    console.log(e.target.files);
    setForm({ ...form, profileImg: e.target.files[0] });
  };

  const removeProfileImg = () => {
    setImgPreview(null);
    setForm({ ...form, profileImg: null });
    setUser({ ...user, profileImg: null });
    console.log("removing profile img");
  };

  const submitProfileImg = async () => {
    const formData = new FormData();
    formData.append("img", form.profileImg);
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}, ${pair[1]}`);
    }
    console.log("form");
    console.log(form.profileImg);

    try {
      await changeProfileImg(formData);
    } catch (error) {
      console.log(error);
    }
  };

  const clickInputFile = (e) => {
    e.preventDefault();
    inputImgRef.current.click();
  };

  if (isLoaded) {
    return (
      <div className="account-settings__personal-info">
        <div className="pathway">
          <span>Link</span>
          <span>
            <ArrowForwardIosIcon sx={{ fontSize: 11 }} />
          </span>
          <span>Personal-Info</span>
        </div>
        <h1>Personal-info</h1>

        {/* NAME */}
        <div className="group">
          <div className="group__flex">
            <div>
              <div className="group__flex__label">name</div>
              <div className="group__flex__value">{`${user.firstName} ${user.lastName}`}</div>
            </div>
            <div>
              {/* <div className="group__flex__change-add" onClick={() => setForm({ ...form, name: { ...form.name, isOn: !form.name.isOn } })}> */}
              <div className="group__flex__change-add" onClick={() => changeFormIsOn("name")}>
                Change
              </div>
            </div>
          </div>
          {form.name.isOn && (
            <form onSubmit={(e) => submitForm(e, changeName)}>
              <div className="input-group">
                {/* <input type="text" id="firstName" name={"firstName"} value={form.name.firstName} onChange={(e) => setForm({ ...form, name: { ...form.name, firstName: e.target.value } })} required /> */}
                <input type="text" id="firstName" name={"firstName"} value={form.name.firstName} onChange={(e) => changeFormProperty(e, "name")} required />
                <label htmlFor="firstName">First Name</label>
              </div>
              <div className="input-group">
                <input type="text" id="lastName" name={"lastName"} value={form.name.lastName} onChange={(e) => changeFormProperty(e, "name")} required />
                <label htmlFor="lastName">Last Name</label>
              </div>
              <ButtonSave />
            </form>
          )}
        </div>

        {/* EMAIL */}
        <div className="group">
          <div className="group__flex">
            <div>
              <div className="group__flex__label">email</div>
              <div className="group__flex__value">{user.email}</div>
            </div>
            <div>
              {/* <div className="group__flex__change-add" onClick={() => setForm({ ...form, name: { ...form.name, isOn: !form.name.isOn } })}> */}
              <div className="group__flex__change-add" onClick={() => changeFormIsOn("email")}>
                Change
              </div>
            </div>
          </div>
          {form.email.isOn && (
            <form onSubmit={(e) => submitForm(e, changeEmail)}>
              <div className="input-group">
                {/* <input type="text" id="firstName" name={"firstName"} value={form.name.firstName} onChange={(e) => setForm({ ...form, name: { ...form.name, firstName: e.target.value } })} required /> */}
                <input type="text" id="email" name={"email"} value={form.email.email} onChange={(e) => changeFormProperty(e, "email")} required />
                <label htmlFor="email">Email</label>
              </div>
              <ButtonSave />
            </form>
          )}
        </div>

        {/* ABOUT */}
        <div className="group">
          <div className="group__flex">
            <div>
              <div className="group__flex__label">about</div>
              <div className="group__flex__value">{user.about}</div>
            </div>
            <div>
              {/* <div className="group__flex__change-add" onClick={() => setForm({ ...form, name: { ...form.name, isOn: !form.name.isOn } })}> */}
              <div className="group__flex__change-add" onClick={() => changeFormIsOn("about")}>
                Change
              </div>
            </div>
          </div>
          {form.about.isOn && (
            <form onSubmit={(e) => submitForm(e, changeAbout)}>
              <div className="input-group">
                {/* <input type="text" id="firstName" name={"firstName"} value={form.name.firstName} onChange={(e) => setForm({ ...form, name: { ...form.name, firstName: e.target.value } })} required /> */}
                <textarea id="about" name={"about"} value={form.about.about} onChange={(e) => changeFormProperty(e, "about")} required />
                <label htmlFor="about">About</label>
              </div>
              <ButtonSave />
            </form>
          )}
        </div>
        <div className="group group-img">
          <div className="img-container-label">Profile Image</div>
          <div className="img-container">
            <img src={imgPreview ? imgPreview : user.profileImg ? `${baseURL}/${user.profileImg}` : NoPhotoAvailable} alt="" onClick={clickInputFile} />
          </div>
          <button className="group-img__btn" onClick={clickInputFile}>
            {imgPreview || user.profileImg ? "Change" : "Add"} Image
          </button>
          {(imgPreview || user.profileImg) && (
            <>
              <button className="group-img__btn" onClick={removeProfileImg}>
                Remove Image
              </button>
              {imgPreview && (
                <button className="button-save" onClick={submitProfileImg}>
                  Save
                </button>
              )}
            </>
          )}
          <input type="file" name="profileImg" onChange={handleImage} ref={inputImgRef} hidden />
        </div>
      </div>
    );
  } else {
    return <Loading />;
  }
};

export default PersonalInfo;
