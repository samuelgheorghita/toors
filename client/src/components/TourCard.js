import React, { useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import StarIcon from "@mui/icons-material/Star";
import Rating from "@mui/material/Rating";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import noProfileImage from "../images/no-profile-image.png";
import noPhotoAvailable from "../images/no-photo-available.png";
import { getSingleTour } from "../api";

const TourCard = ({ price, description, _id: id, images, movingTime, location, title, createdBy: username, transportation }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const currentUsername = useSelector((state) => state.users.username);

  const navigate = useNavigate();
  const ipAdress = "http://localhost:5000/";
  const rating = 3.7;
  const numOfReviews = 251;

  const goToSingleTour = async () => {
    try {
      console.log("clicking");
      // const response = await getSingleTour(id);
      console.log("after await");
      navigate(`/tours/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const imagesUI = [];
  for (let i = 0; i < 3; i++) {
    if (images[i]) {
      const elem = images[i];
      imagesUI.push(<img src={ipAdress + elem}></img>);
    } else {
      imagesUI.push(<img src={noPhotoAvailable}></img>);
    }
  }

  const ratingChanged = () => {};

  // Change the star rating with the material ui. For somewhat reason it didn't work. The half star didn't render properly
  return (
    <div className="card" onClick={goToSingleTour}>
      <div className="card__header">
        <div className="card__header__transportation-favorite">
          <div>
            <span>
              <DirectionsWalkIcon />
            </span>
            <span>{transportation}</span>
          </div>
          <div className="card__header__favorites" onClick={toggleFavorite}>
            <span>Save to favorites</span>
            <span>{isFavorite ? <FavoriteIcon color="error" sx={{ fontSize: 25 }} /> : <FavoriteBorderIcon sx={{ fontSize: 25 }} />}</span>
          </div>
        </div>
        <h3 className="card__header__title">{title}</h3>
        <h5 className="card__header__location">{location}</h5>
      </div>
      <div className="card__grid">
        <div className="card__grid__details">
          <span>
            <div className="card__grid__details__label">Duration</div>
            <div className="card__grid__details__value">{movingTime}</div>
          </span>
          <span>
            <div className="card__grid__details__label">Price</div>
            <div className="card__grid__details__value">{price ? `${price}€` : "n/a"}</div>
          </span>
          <span>
            <div className="card__grid__details__label">Rating</div>
            <div className="card__grid__details__value">
              <span>
                <StarIcon sx={{ fontSize: 18, color: "#E8E405" }} />
              </span>
              <span className="card__grid__details__icon">
                <span>5.0</span>
                <span>250</span>
              </span>
            </div>
          </span>
        </div>
        <div className="card__grid__username">
          <div className="card__grid__username__img-div">
            <img src={noProfileImage} alt="" />
          </div>
          <div className="card__grid__username__name">{username}</div>
        </div>
        {images.length > 0 && (
          <>
            <div className="card__grid__main-image">{imagesUI[0]}</div>
            <div className="card__grid__secondary-image-1">{imagesUI[1]}</div>
            <div className="card__grid__secondary-image-2">{imagesUI[2]}</div>
          </>
        )}
      </div>
      <div className="card__info">
        <div className="card__info__desc">{description}</div>
        <div className="card__info__reviews">
          <div className="card__info__reviews__review">
            <div>
              <Rating name="read-only" value={5} readOnly sx={{ fontSize: 16 }} />
            </div>
            <div>Lovely tour</div>
          </div>
          <div className="card__info__reviews__review">
            <div>
              <Rating name="read-only" value={5} readOnly sx={{ fontSize: 16 }} />
            </div>
            <div>Lovely tour</div>
          </div>
        </div>
        <button className="card__info__btn-div">
          <div>View Tour</div>
          <div className="card__info__btn-div__btn">
            <ArrowForwardIcon />
          </div>
        </button>
      </div>
      {/* <img src="http://localhost:5000/1662891623513sunrise.jpg" alt="" /> */}
    </div>
  );
};

export default TourCard;
