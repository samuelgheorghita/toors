import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import * as api from "../../api";
import Loading from "../../components/Loading";
import ReadMore from "../../components/ReadMore";
import TourCard from "../../components/TourCard";
import FavTemplate from "./FavTemplate";

const Favorites = () => {
  return <FavTemplate typeOfPage="Favorites" />;
};

export default Favorites;
