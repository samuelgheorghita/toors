import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";

import logoImg from "../images/logo-toors.png";
import { useOnClickOutside } from "../tools/hooks/eventListeners";

const Navbar = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);
  const dropdownMenuRef = useRef(null);

  useOnClickOutside(dropdownMenuRef, () => setIsMenuOn(false));

  return (
    <div className="navbar">
      <Link to="/">
        <div className="navbar__logo">
          <img src={logoImg} alt="" />
        </div>
      </Link>
      <div className="navbar-btn">Search something here</div>

      <div className="navbar__right">
        <Link to="/tours/add-tour" className="navbar-btn navbar__right__add-tour">
          Add tour
        </Link>

        <div className="navbar-btn navbar__right__user" onClick={(e) => setIsMenuOn((state) => !state)} ref={dropdownMenuRef}>
          <div className="navbar__right__user__icon">
            <MenuIcon />
          </div>
          <AccountCircleIcon sx={{ fontSize: 35 }} />
          {isMenuOn && (
            <div className="navbar__right__user__dropdown">
              <Link to="/users/login" className="navbar__right__user__dropdown__link">
                Login
              </Link>
              <Link to="/users/signup" className="navbar__right__user__dropdown__link">
                Signup
              </Link>
              <Link to="/users/favorites" className="navbar__right__user__dropdown__link">
                Favorites
              </Link>
              <Link to="/users/my-tours" className="navbar__right__user__dropdown__link">
                My trails
              </Link>
              <Link to="/users/account-settings" className="navbar__right__user__dropdown__link">
                Settings
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
