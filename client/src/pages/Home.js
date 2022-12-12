import React, { useEffect, useState, useSyncExternalStore } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import * as api from "../api";
import { setAllTours } from "../actions/tours";
import { getUserByUsername } from "../actions/users";
import SearchBar from "../components/SearchBar";
import TourCard from "../components/TourCard";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import { objectToParams } from "../tools/functions/functions.js";

const Home = () => {
  const favorites = useSelector((state) => state.users.user?.favorites);
  const username = useSelector((state) => state.users.username);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tours, setTours] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({ transportation: [], costMin: "", costMax: "" });
  console.log(filters);

  // Pagination
  const [currentPage, setCurrentPage] = useState(2);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const toursPagination = tours ? tours.slice(currentPage * postsPerPage - postsPerPage, currentPage * postsPerPage) : [];

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.getTours("");
      setTours(data);
      console.log(data);

      if (username) {
        await dispatch(getUserByUsername(username));
        console.log("trying to getUserByUsername");
      }

      setIsLoaded(true);
    };

    fetchData().catch((err) => {
      console.log(err);
      navigate("/users/login");
    });
  }, [username]);

  const applyFilters = async () => {
    let queryString = objectToParams(filters);
    if (!queryString) {
      queryString = "";
    }
    const data = await api.getTours(queryString);
    setTours(data);
    console.log(data);
  };

  const toursUI = toursPagination.map((tour) => {
    return <TourCard key={tour._id} {...tour} favorites={favorites} />;
  });

  if (isLoaded) {
    return (
      <div className="home">
        <SearchBar />
        <div className="filters-and-cards-container">
          <Filters applyFilters={applyFilters} filters={filters} setFilters={setFilters} />
          <div className="cards-container">
            {toursUI}

            <Pagination totalPosts={tours.length} postsPerPage={postsPerPage} setCurrentPage={setCurrentPage} />
          </div>
        </div>
      </div>
    );
  } else {
    return <Loading />;
  }
};

export default Home;
