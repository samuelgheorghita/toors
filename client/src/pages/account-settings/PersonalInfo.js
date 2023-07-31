import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Link } from "react-router-dom";

import { getUserByUsername } from "../../apis";
import { changeAbout, changeEmail, changeName, changeProfileImg } from "../../apis/account-settings/personalInfoApi";
import Loading from "../../components/Loading";
import NoPhotoAvailable from "../../images/no-photo-available.png";
import { baseURL, prePathS } from "../../apis/globalApi";
import { changeProfileImg as changeProfileImgAction } from "../../actions/users";

const ButtonSave = () => {
  return (
    <button type="submit" className="button-save">
      Save
    </button>
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

  const dispatch = useDispatch();

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
    });
    setUser(user);
    setIsLoaded(true);
  };

  const submitForm = async (e, apiFunction) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const readyObj = Object.fromEntries(formData.entries());

    try {
      const response = await apiFunction(readyObj);
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
    setForm({ ...form, profileImg: e.target.files[0] });

    // Changing the image globally so that the profile image in the header can update
    dispatch(changeProfileImgAction(e.target.files[0]));
  };

  const removeProfileImg = () => {
    setImgPreview(null);
    setForm({ ...form, profileImg: null });
    setUser({ ...user, profileImg: null });
  };

  const submitProfileImg = async () => {
    const formData = new FormData();
    formData.append("img", form.profileImg);

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
          <Link to={`${prePathS}/users/account-settings`}>Settings</Link>
          {/* <span>Link</span> */}
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
              <button className="group__flex__change-add" onClick={() => changeFormIsOn("name")}>
                Change
              </button>
            </div>
          </div>
          {form.name.isOn && (
            <form onSubmit={(e) => submitForm(e, changeName)}>
              <div className="input-group">
                {/* <input type="text" id="firstName" name={"firstName"} value={form.name.firstName} onChange={(e) => setForm({ ...form, name: { ...form.name, firstName: e.target.value } })} required /> */}
                <input
                  type="text"
                  id="firstName"
                  name={"firstName"}
                  value={form.name.firstName}
                  onChange={(e) => changeFormProperty(e, "name")}
                  required
                />
                <label htmlFor="firstName">First Name</label>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  id="lastName"
                  name={"lastName"}
                  value={form.name.lastName}
                  onChange={(e) => changeFormProperty(e, "name")}
                  required
                />
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
              <button className="group__flex__change-add" onClick={() => changeFormIsOn("email")}>
                Change
              </button>
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
              <button className="group__flex__change-add" onClick={() => changeFormIsOn("about")}>
                Change
              </button>
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
            <img
              src={imgPreview ? imgPreview : user.profileImg?.url ? user.profileImg.url : NoPhotoAvailable}
              alt="User uploaded profile image"
              onClick={clickInputFile}
            />
          </div>
          <button className="group-img__btn" onClick={clickInputFile}>
            {imgPreview || user.profileImg?.url ? "Change" : "Add"} Image
          </button>
          {(imgPreview || user.profileImg?.url) && (
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
          <input type="file" name="profileImg" onChange={handleImage} ref={inputImgRef} hidden id="profileImg" />
          {/* <label htmlFor="profileImg" className="visually-hidden">
            Change profile image
          </label> */}
        </div>
      </div>
    );
  } else {
    return <Loading />;
  }
};

export default PersonalInfo;
