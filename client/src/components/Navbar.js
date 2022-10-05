import React from "react";
import { Link } from "react-router-dom";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar = () => {
  return (
    <div className="navbar">
      <div>
        <Link to="/" className="navbar__link">
          Home
        </Link>
        <Link to="/tours/addtour" className="navbar__link">
          Add New Tour
        </Link>
      </div>
      <div className="navbar__links-div">
        <Link to="/users/login" className="navbar__link">
          Login
        </Link>
        <Link to="/users/signup" className="navbar__link">
          Signup
        </Link>
        <AccountCircleRoundedIcon className="navbar__icon" sx={{ fontSize: 27 }} />
      </div>
    </div>
  );
};

export default Navbar;
