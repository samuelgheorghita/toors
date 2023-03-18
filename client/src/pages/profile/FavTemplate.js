import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import * as api from "../../api";
import { isoDateToMonthAndYear } from "../../tools/functions/functions";
import Loading from "../../components/Loading";
import ReadMore from "../../components/ReadMore";
import TourCard from "../../components/TourCard";
import Pagination from "../../components/Pagination";

const FavTemplate = ({ typeOfPage }) => {
  const [tours, setTours] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const toursPagination = tours ? tours.slice(currentPage * postsPerPage - postsPerPage, currentPage * postsPerPage) : [];

  const username = useSelector((state) => state.users.username);
  const navigate = useNavigate();
  const ipAdress = "http://localhost:5000/";

  let fetchToursFunc = null;

  console.log(typeOfPage);

  try {
    if (typeOfPage === "Favorites") {
      fetchToursFunc = () => api.getFavorites(username);
      console.log("inside the if");
    } else if (typeOfPage === "MyTours") {
      fetchToursFunc = () => api.getMyTours(username);
      console.log("inside the if");
    }
  } catch (error) {
    console.log(error);
  }

  useEffect(() => {
    const fetchData = async () => {
      const tours = await fetchToursFunc();
      console.log("api get sent, username: " + username);
      console.log(tours);
      setTours(tours);

      const user = await api.getUserByUsername(username);
      console.log(user);
      setUser(user);

      setIsLoaded(true);
    };

    fetchData().catch((err) => {
      console.log(err);
      navigate("/users/login");
    });
  }, []);

  if (isLoaded) {
    return (
      <div className="favorites-page">
        <div className="favorites-page__wrapper">
          <h1 className="favorites-page__title">{`${user.username} - (${user.firstName} ${user.lastName})`}</h1>
          {/* <div className="favorites-page__type-of-page"></div> */}
          <div className="main-grid">
            <div className="profile-info">
              <div className="img-div">
                <img src={ipAdress + user.profileImg} alt="" />
              </div>
              <div className="description">{user.about ? <ReadMore text={user.about} length={50} /> : "No description"}</div>
              {user.createdAt && <div className="creation">{"Member since " + isoDateToMonthAndYear(user.createdAt)}</div>}
            </div>
            {tours.length > 0 ? (
              <div className="tours">
                {toursPagination.map((tour) => {
                  return <TourCard key={tour._id} {...tour} favorites={user.favorites} />;
                })}
                <Pagination totalPosts={tours.length} postsPerPage={postsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
              </div>
            ) : (
              "You did not create any tour"
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return <Loading />;
  }
};

export default FavTemplate;
