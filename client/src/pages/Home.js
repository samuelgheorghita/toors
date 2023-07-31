import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import * as api from "../apis";
import { prePathS } from "../apis/globalApi";
import { setTourFilters } from "../actions/tours";
import { getUserByUsername } from "../actions/users";
import TourCard from "../components/TourCard";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import { objectToParams } from "../tools/functions/functions.js";

const Home = () => {
  const username = useSelector((state) => state.users.username);
  const filtersRedux = useSelector((state) => state.tours.filters);
  const filtersReduxSkip = useSelector((state) => state.tours.filters.pagSkip);
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
  const [postsPerPage, setPostsPerPage] = useState(1);
  const [totalTours, setTotalTours] = useState(0);
  // const toursPagination = tours ? tours.slice(currentPage * postsPerPage - postsPerPage, currentPage * postsPerPage) : [];

  useEffect(() => {
    const fetchData = async () => {
      const filtersStr = objectToParams(filtersRedux);
      const { data, countTours } = await api.getTours(filtersStr);
      setTotalTours(countTours);
      setTours(data);

      if (username) {
        await dispatch(getUserByUsername(username));
      }

      setIsLoaded(true);
    };

    fetchData().catch((err) => {
      console.log(err);
      navigate(`${prePathS}/users/login`);
    });
  }, [username, filtersReduxSkip]);

  async function clickApplyFiltersBtn(e) {
    e.preventDefault();
    dispatch(setTourFilters(filters));
    await applyFilters();
  }

  const applyFilters = async () => {
    console.log("inside applyFilters");
    console.log(filtersRedux);
    let queryString = objectToParams(filtersRedux);
    if (!queryString) {
      queryString = "";
    }
    try {
      console.log("*********************************");
      const { data, countTours } = await api.getTours(queryString);
      console.log(data);
      console.log("--------------------------------");

      setTours(data);
      // If this expession isnt' true it means that filters parameters have changed and not only the pagination
      // TODO: this expression doesn't consider rare cases where you could have changed the filters parameters but stil have the same number of tours returned
      if (countTours != totalTours) {
        setCurrentPage(1);
        setTotalTours(countTours);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const toursUI = tours?.map((tour) => {
    return <TourCard key={tour._id} {...tour} />;
  });

  //TODO: add a more inspired h1, then make it visible
  if (isLoaded) {
    return (
      <div className="home">
        <h1 className="visually-hidden">Tours</h1>
        <div className="home__wrapper">
          <Filters clickApplyFiltersBtn={clickApplyFiltersBtn} filters={filters} setFilters={setFilters} />

          <h2 className="visually-hidden">Tours list</h2>
          {tours && tours.length > 0 ? (
            <div className="home__cards-container">
              {toursUI}

              <Pagination {...{ currentPage, setCurrentPage, postsPerPage, totalTours }} />
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
