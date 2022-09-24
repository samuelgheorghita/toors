import React, { useEffect, useState, useSyncExternalStore } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setAllTours } from "../actions/tours";
import SearchBar from "../components/SearchBar";
import TourCard from "../components/TourCard";
import Filters from "../components/Filters";

const Home = () => {
  const isLoaded = useSelector((state) => state.tours.isLoaded);
  const state = useSelector((state) => state);
  const tours = useSelector((state) => state.tours.list);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(state);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setAllTours());
    };

    fetchData().catch((err) => {
      console.log(err);
      navigate("/users/login");
    });
  }, []);

  if (isLoaded) {
    const toursUI = tours.map((tour, index) => {
      return <TourCard key={index} {...tour} />;
    });

    return (
      <div className="home">
        <SearchBar />
        <div className="filters-and-cards-container">
          <Filters />
          <div className="cards-container">{toursUI}</div>
        </div>
      </div>
    );
  }
};

export default Home;
