import React, { useEffect, useState, useSyncExternalStore } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setAllTours } from "../actions/tours";
import { getUserByUsername } from "../actions/users";
import SearchBar from "../components/SearchBar";
import TourCard from "../components/TourCard";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";

const Home = () => {
  const favorites = useSelector((state) => state.users.user?.favorites);
  const isLoaded = useSelector((state) => state.tours.isLoaded);
  const username = useSelector((state) => state.users.username);
  const tours = useSelector((state) => state.tours.list);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({ transportation: [] });
  console.log(filters);

  // Pagination
  const [currentPage, setCurrentPage] = useState(2);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const toursPagination = tours.slice(currentPage * postsPerPage - postsPerPage, currentPage * postsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(setAllTours());
      if (username) {
        await dispatch(getUserByUsername(username));
        console.log("trying to getUserByUsername");
      }
    };

    fetchData().catch((err) => {
      console.log(err);
      navigate("/users/login");
    });
  }, [username]);

  const toursUI = toursPagination.map((tour) => {
    return <TourCard key={tour._id} {...tour} favorites={favorites} />;
  });

  if (isLoaded) {
    return (
      <div className="home">
        <SearchBar />
        <div className="filters-and-cards-container">
          <Filters filters={filters} setFilters={setFilters} />
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
