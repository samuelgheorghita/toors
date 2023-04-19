import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import * as api from "../api";
import { setTourFilters } from "../actions/tours";
import { getUserByUsername } from "../actions/users";
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

  // Set fliters saved in redux state
  useEffect(() => {
    setFilters(filtersRedux);
  }, [filtersRedux]);

  // useEffect(() => {
  //   console.log("favoritesRedux");
  //   console.log(favoritesRedux);
  //   setFavorites(favoritesRedux);
  // }, [isLoaded]);

  const applyFilters = async (e) => {
    e.preventDefault();
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

  //TODO: add a more inspired h1, then make it visible
  if (isLoaded) {
    return (
      <div className="home">
        <h1 className="visually-hidden">Tours</h1>
        <div className="home__wrapper">
          <Filters applyFilters={applyFilters} filters={filters} setFilters={setFilters} />

          <h2 className="visually-hidden">Tours list</h2>
          {tours.length > 0 ? (
            <div className="home__cards-container">
              {toursUI}

              <Pagination totalPosts={tours.length} postsPerPage={postsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </div>
          ) : (
            "We're sorry, there's no results that match your criteria."
          )}
        </div>
      </div>
    );
  } else {
    return <Loading />;
  }
};

export default Home;
