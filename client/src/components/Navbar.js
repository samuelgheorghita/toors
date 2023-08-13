import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";

import logoImg from "../images/logo-toors.png";
import { useOnClickOutsideModified } from "../tools/hooks/eventListeners";
import * as api from "../apis";
import { logoutUser } from "../actions/users";
import { prePathS } from "../apis/globalApi";
import SearchBar from "./SearchBar";
import crossIcon from "../images/icons/cross-svgrepo-com.svg";
import useDebounce from "../tools/hooks/useDebounce";
import { setTourFilters } from "../actions/tours";

const Navbar = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);
  const dropdownMenuRef = useRef(null);
  const dropdownMenuRefMobile = useRef(null);
  const username = useSelector((state) => state.users.username);
  // const profileImg = useSelector((state) => state.users).profileImg;
  const profileImg = useSelector((state) => state.users.profileImg);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useOnClickOutsideModified(dropdownMenuRef, dropdownMenuRefMobile, () => setIsMenuOn(false));

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.log(error);
    }
    dispatch(logoutUser());

    navigate(`${prePathS}`);
  };

  // Search component functionality.
  // TODO: Figure out how to have only 1 Search component for the 2 versions of the navbar.
  // 2 versions is causing unncessery rendering. Then transfer this logic into the component itself.
  const [searchInput, setSearchInput] = useState("");
  const { isLoaded } = useDebounce(searchInput, search);

  function search() {
    dispatch(setTourFilters({ searchStr: searchInput })); // dispatch the action creator function
    navigate(`${prePathS}`);
  }
  // End of search functionality

  const logoElems = (
    <Link to={`${prePathS}`}>
      <div className="navbar__logo">
        <img src={logoImg} alt="Toors logo" />
      </div>
    </Link>
  );

  const navUls = (
    <ul>
      {!username && (
        <>
          <li>
            <Link to={`${prePathS}/users/login`} className="navbar__right__user__dropdown__link">
              Login
            </Link>
          </li>
          <li>
            <Link to={`${prePathS}/users/signup`} className="navbar__right__user__dropdown__link">
              Signup
            </Link>
          </li>
        </>
      )}
      {username && (
        <>
          <li>
            <button className="navbar__right__user__dropdown__link navbar__btn" onClick={logout}>
              Logout
            </button>
          </li>
          <li>
            <Link to={`${prePathS}/users/favorites`} className="navbar__right__user__dropdown__link">
              Favorites
            </Link>
          </li>
          <li>
            <Link to={`${prePathS}/users/my-tours`} className="navbar__right__user__dropdown__link">
              My trails
            </Link>
          </li>
          <li>
            <Link to={`${prePathS}/users/account-settings`} className="navbar__right__user__dropdown__link">
              Settings
            </Link>
          </li>
        </>
      )}
    </ul>
  );

  return (
    <>
      <header className="navbar navbar-desktop">
        {logoElems}
        <SearchBar {...{ searchInput, setSearchInput, isLoaded, search }} />

        <div className="navbar__right">
          <Link to={`${prePathS}/tours/add-tour`} className="navbar-btn navbar__right__add-tour">
            Add tour
          </Link>

          <div className="navbar__right__nav-container">
            <button
              className="navbar-btn navbar__right__user"
              onClick={(e) => {
                setIsMenuOn((state) => !state);
              }}
              ref={dropdownMenuRef}
            >
              <span className="visually-hidden">Menu Button</span>
              <div className="navbar__right__user__icon">
                <MenuIcon />
              </div>
              {username && profileImg?.url ? (
                <div className="navbar__profile-img">
                  <img src={profileImg?.url instanceof File ? URL.createObjectURL(profileImg) : profileImg?.url} alt="profile" />
                </div>
              ) : (
                <AccountCircleIcon sx={{ fontSize: 35 }} />
              )}
            </button>
            {isMenuOn && <nav className="navbar__right__user__dropdown">{navUls}</nav>}
          </div>
        </div>
      </header>

      <header className="navbar navbar-mobile">
        {logoElems}
        <div className="navbar__right">
          <button onClick={() => setIsMenuOn((state) => !state)} className="navbar-btn navbar__right__user">
            <span className="visually-hidden">Menu Button</span>
            <div className="navbar__right__user__icon">
              <MenuIcon />
            </div>
            {username && profileImg?.url ? (
              <div className="navbar__profile-img">
                <img src={profileImg.url} alt="profile" />
              </div>
            ) : (
              <AccountCircleIcon sx={{ fontSize: 35 }} />
            )}
          </button>
          {isMenuOn && (
            <nav className="navbar__right__user__dropdown" ref={dropdownMenuRefMobile}>
              <button className="navbar-mobile__close-btn">
                <img src={crossIcon} alt="close modal icon" onClick={() => setIsMenuOn((state) => !state)} />
              </button>
              <SearchBar {...{ searchInput, setSearchInput, isLoaded, search }} />
              <Link to={`${prePathS}/tours/add-tour`} className="navbar-btn navbar__right__add-tour">
                Add tour
              </Link>
              {navUls}
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;
