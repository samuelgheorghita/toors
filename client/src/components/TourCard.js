import React, { useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import StarIcon from "@mui/icons-material/Star";
import Rating from "@mui/material/Rating";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import noProfileImage from "../images/no-profile-image.png";
import noPhotoAvailable from "../images/no-photo-available.png";
import * as api from "../api";
import { baseURLSlash } from "../apis/globalApi";
import ReadMore from "./ReadMore";
import { changeFavorites } from "../actions/users";

const TourCard = ({
  cost,
  description,
  _id: id,
  favorites,
  images,
  movingTime,
  location,
  profileImg,
  title,
  createdBy: username,
  transportation,
  viewpoints,
}) => {
  const favoritesRedux = useSelector((state) => state.users.favorites);
  const isFavorite = favoritesRedux?.includes(id) ? true : false;
  const currentUsername = useSelector((state) => state.users.username);
  const allViewpointsImages = Object.values(viewpoints).reduce((finalArr, curr) => [...finalArr, ...curr.images], []);

  const ipAdress = "http://localhost:5000/";
  const rating = 3.7;
  const numOfReviews = 251;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const imagesUI = [];
  for (let i = 0; i < 3; i++) {
    if (images[i]) {
      const elem = images[i];
      imagesUI.push(<img src={ipAdress + elem}></img>);
    } else {
      if (allViewpointsImages[i]) {
        imagesUI.push(<img src={ipAdress + allViewpointsImages[i]}></img>);
      } else {
        imagesUI.push(<img src={noPhotoAvailable}></img>);
      }
    }
  }

  const toggleFavorite = async (e) => {
    e.stopPropagation();

    try {
      await api.toggleFavorite({ tourId: id });

      dispatch(changeFavorites(id));
      console.log("favorite is toggling");
    } catch (error) {
      console.log(error);
      navigate("/users/login");
    }
  };

  const ratingChanged = () => {};

  console.log(profileImg);

  // Change the star rating with the material ui. For somewhat reason it didn't work. The half star didn't render properly
  return (
    <div className="tour-card" onClick={() => navigate(`/tours/${id}`)}>
      <div className="tour-card__header">
        <div className="tour-card__header__transportation-favorite">
          <div>
            <span>
              <DirectionsWalkIcon />
            </span>
            <span>{transportation}</span>
          </div>
          <div className="tour-card__header__favorites" onClick={toggleFavorite}>
            <span>Save to favorites</span>
            <span>{isFavorite ? <FavoriteIcon color="error" sx={{ fontSize: 25 }} /> : <FavoriteBorderIcon sx={{ fontSize: 25 }} />}</span>
          </div>
        </div>
        <h3 className="tour-card__header__title">{title}</h3>
        <h5 className="tour-card__header__location">{location}</h5>
      </div>
      <div className="tour-card__grid">
        <div className="tour-card__grid__details">
          <span>
            <div className="tour-card__grid__details__label">Duration</div>
            <div className="tour-card__grid__details__value">{movingTime}</div>
          </span>
          <span>
            <div className="tour-card__grid__details__label">Cost</div>
            <div className="tour-card__grid__details__value">{cost ? `${cost}€` : "n/a"}</div>
          </span>
          <span>
            <div className="tour-card__grid__details__label">Rating</div>
            <div className="tour-card__grid__details__value">
              <span>
                <StarIcon sx={{ fontSize: 18, color: "#E8E405" }} />
              </span>
              <span className="tour-card__grid__details__icon">
                <span>5.0</span>
                <span>250</span>
              </span>
            </div>
          </span>
        </div>
        <div className="tour-card__grid__username">
          <div className="tour-card__grid__username__img-div">
            <img src={profileImg ? baseURLSlash + profileImg : noProfileImage} alt="" />
          </div>
          <div className="tour-card__grid__username__name">{username}</div>
        </div>
        {(images.length > 0 || allViewpointsImages.length > 0) && (
          <>
            <div className="tour-card__grid__main-image">{imagesUI[0]}</div>
            <div className="tour-card__grid__secondary-image-1">{imagesUI[1]}</div>
            <div className="tour-card__grid__secondary-image-2">{imagesUI[2]}</div>
          </>
        )}
      </div>
      <div className="tour-card__info">
        <div className="tour-card__info__desc">{<ReadMore text={description} length={50} />}</div>
        <div className="tour-card__info__reviews">
          <div className="tour-card__info__reviews__review">
            <div>
              <Rating name="read-only" value={5} readOnly sx={{ fontSize: 16 }} />
            </div>
            <div>Lovely tour</div>
          </div>
          <div className="tour-card__info__reviews__review">
            <div>
              <Rating name="read-only" value={5} readOnly sx={{ fontSize: 16 }} />
            </div>
            <div>Lovely tour</div>
          </div>
        </div>
        <button className="tour-card__info__btn-div">
          <div>View Tour</div>
          <div className="tour-card__info__btn-div__btn">
            <ArrowForwardIcon />
          </div>
        </button>
      </div>
    </div>
  );
};

export default TourCard;
