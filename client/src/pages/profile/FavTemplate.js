import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import * as api from "../../apis";
import { isoDateToMonthAndYear, objectToParams } from "../../tools/functions/functions";
import Loading from "../../components/Loading";
import ReadMore from "../../components/ReadMore";
import TourCard from "../../components/TourCard";
import Pagination from "../../components/Pagination";
import { prePathS } from "../../apis/globalApi";

const FavTemplate = ({ typeOfPage }) => {
  const [tours, setTours] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [totalTours, setTotalTours] = useState(0);
  const pagSkip = (currentPage - 1) * postsPerPage;

  const username = useSelector((state) => state.users.username);
  const navigate = useNavigate();

  const params = objectToParams({ username, pagSkip });

  let fetchToursFunc = null;

  console.log(typeOfPage);

  try {
    if (typeOfPage === "Favorites") {
      fetchToursFunc = () => api.getFavorites(params);
    } else if (typeOfPage === "MyTours") {
      fetchToursFunc = () => api.getMyTours(params);
    }
  } catch (error) {
    console.log(error);
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data, countTours } = await fetchToursFunc();
      console.log("api get sent, username: " + username);
      setTours(data);

      const user = await api.getUserByUsername(username);
      setUser(user);
      setTotalTours(countTours);

      setIsLoaded(true);
    };

    fetchData().catch((err) => {
      console.log(err);
      navigate(`${prePathS}/users/login`);
    });
  }, [currentPage]);

  if (isLoaded) {
    return (
      <div className="favorites-page">
        <div className="favorites-page__wrapper">
          <h1 className="favorites-page__title">{`${user.username} - (${user.firstName} ${user.lastName})`}</h1>
          {/* <div className="favorites-page__type-of-page"></div> */}
          <div className="main-grid">
            <div className="profile-info">
              <div className="img-div">
                <img src={user.profileImg.url} alt="user profile" />
              </div>
              <div className="description">{user.about ? <ReadMore text={user.about} length={50} /> : "No description"}</div>
              {user.createdAt && <div className="creation">{"Member since " + isoDateToMonthAndYear(user.createdAt)}</div>}
            </div>
            {tours?.length > 0 ? (
              <div className="tours">
                {tours.map((tour) => {
                  return <TourCard key={tour._id} {...tour} favorites={user.favorites} />;
                })}
                <Pagination {...{ currentPage, setCurrentPage, postsPerPage, totalTours }} />
              </div>
            ) : (
              "Nothing has been found"
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
