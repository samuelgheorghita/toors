import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";

import logoImg from "../images/logo-toors.png";
import { useOnClickOutside } from "../tools/hooks/eventListeners";
import * as api from "../api";
import { logoutUser } from "../actions/users";
import { baseURLSlash } from "../apis/globalApi";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);
  const dropdownMenuRef = useRef(null);
  const username = useSelector((state) => state.users.username);
  const profileImg = useSelector((state) => state.users.profileImg);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useOnClickOutside(dropdownMenuRef, () => setIsMenuOn(false));

  const logout = async () => {
    try {
      const response = await api.logout();
    } catch (error) {
      console.log(error);
    }
    dispatch(logoutUser());

    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/">
        <div className="navbar__logo">
          <img src={logoImg} alt="" />
        </div>
      </Link>
      <SearchBar />

      <div className="navbar__right">
        <Link to="/tours/add-tour" className="navbar-btn navbar__right__add-tour">
          Add tour
        </Link>

        <div className="navbar-btn navbar__right__user" onClick={(e) => setIsMenuOn((state) => !state)} ref={dropdownMenuRef}>
          <div className="navbar__right__user__icon">
            <MenuIcon />
          </div>
          {username ? (
            <div className="navbar__profile-img">
              <img src={baseURLSlash + profileImg} alt="profile image" />
            </div>
          ) : (
            <AccountCircleIcon sx={{ fontSize: 35 }} />
          )}
          {isMenuOn && (
            <div className="navbar__right__user__dropdown">
              {!username && (
                <>
                  <Link to="/users/login" className="navbar__right__user__dropdown__link">
                    Login
                  </Link>
                  <Link to="/users/signup" className="navbar__right__user__dropdown__link">
                    Signup
                  </Link>
                </>
              )}
              {username && (
                <>
                  <button className="navbar__right__user__dropdown__link navbar__btn" onClick={logout}>
                    Logout
                  </button>
                  <Link to="/users/favorites" className="navbar__right__user__dropdown__link">
                    Favorites
                  </Link>
                  <Link to="/users/my-tours" className="navbar__right__user__dropdown__link">
                    My trails
                  </Link>
                  <Link to="/users/account-settings" className="navbar__right__user__dropdown__link">
                    Settings
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
