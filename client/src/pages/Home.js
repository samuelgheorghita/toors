import React, { useEffect, useState, useSyncExternalStore } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import * as api from "../api";
import { setTourFilters } from "../actions/tours";
import { getUserByUsername } from "../actions/users";
import SearchBar from "../components/SearchBar";
import TourCard from "../components/TourCard";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import { objectToParams } from "../tools/functions/functions.js";

const Home = () => {
  const [favorites, setFavorites] = useState(null);
  const username = useSelector((state) => state.users.username);
  const filtersRedux = useSelector((state) => state.tours.filters);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tours, setTours] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    transportation: [],
    costMin: "",
    costMax: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const toursPagination = tours ? tours.slice(currentPage * postsPerPage - postsPerPage, currentPage * postsPerPage) : [];
  const favoritesRedux = useSelector((state) => state.users.user?.favorites);

  useEffect(() => {
    const fetchData = async () => {
      const filtersStr = objectToParams(filtersRedux);
      const data = await api.getTours(filtersStr);
      setTours(data.reverse());
      console.log(data);

      if (username) {
        await dispatch(getUserByUsername(username));
      }

      setIsLoaded(true);
    };

    fetchData().catch((err) => {
      console.log(err);
      navigate("/users/login");
    });
  }, [username]);

  // useEffect(() => {
  //   console.log("favoritesRedux");
  //   console.log(favoritesRedux);
  //   setFavorites(favoritesRedux);
  // }, [isLoaded]);

  const applyFilters = async () => {
    dispatch(setTourFilters(filters));
    let queryString = objectToParams(filters);
    if (!queryString) {
      queryString = "";
    }
    try {
      const data = await api.getTours(queryString);
      setTours(data.reverse());
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const toursUI = toursPagination.map((tour) => {
    return <TourCard key={tour._id} {...tour} favorites={favorites} />;
  });

  if (isLoaded) {
    return (
      <div className="home">
        <div className="home__wrapper">
          <Filters applyFilters={applyFilters} filters={filters} setFilters={setFilters} />
          <div className="home__cards-container">
            {toursUI}

            <Pagination totalPosts={tours.length} postsPerPage={postsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </div>
        </div>
      </div>
    );
  } else {
    return <Loading />;
  }
};

export default Home;
