import React from "react";
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
import { prePathS } from "../apis/globalApi";
import ReadMore from "./ReadMore";
import useToggleIsFavorite from "../tools/hooks/useToggleIsFavorite";

const TourCard = ({
  cost,
  description,
  _id: id,
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
  const allViewpointsImages = Object.values(viewpoints).reduce((finalArr, curr) => [...finalArr, ...curr.images], []);
  let isImagesPresent = true;

  const { switchFavorites } = useToggleIsFavorite();
  const navigate = useNavigate();

  // Logic for displaying the thumbnails
  const imagesUI = [];
  // (() => {
  //   for (let i = 0; i < 3; i++) {
  //     if (images[i]) {
  //       const elem = images[i];
  //       imagesUI.push(<img src={elem.url} alt="User uploaded"></img>);
  //     }
  //   }
  //   let numOfImgsToAdd = 3 - imagesUI.length;
  //   for (let i = 0; i < numOfImgsToAdd; i++) {
  //     if (allViewpointsImages[i]) {
  //       const image = allViewpointsImages[i];
  //       imagesUI.push(<img src={image.url} alt="User uploaded" />);
  //     }
  //   }

  //   numOfImgsToAdd = 3 - imagesUI.length;
  //   // If there's no image, then...
  //   if (numOfImgsToAdd === 3) {
  //     isImagesPresent = false;
  //     return;
  //   }

  //   for (let i = 0; i < numOfImgsToAdd; i++) {
  //     imagesUI.push(<img src={noPhotoAvailable} alt="User uploaded"></img>);
  //   }
  // })();

  // TODO: Change the star rating with the material ui. For somewhat reason it didn't work. The half star didn't render properly
  return (
    <div className="tour-card" onClick={() => navigate(`${prePathS}/tours/${id}`)}>
      <div className="tour-card__header">
        <div className="tour-card__header__transportation-favorite">
          <div>
            <span>
              <DirectionsWalkIcon />
            </span>
            <span>{transportation}</span>
          </div>
          {/* Considering changing next line with a button. Semantically correct but it ruins navigation */}
          <div className="tour-card__header__favorites" onClick={(e) => switchFavorites(id, e)}>
            <span>Save to favorites</span>
            <span>{isFavorite ? <FavoriteIcon color="error" sx={{ fontSize: 25 }} /> : <FavoriteBorderIcon sx={{ fontSize: 25 }} />}</span>
          </div>
        </div>
        <h3 className="tour-card__header__title">{title}</h3>
        <h4 className="tour-card__header__location">{location}</h4>
      </div>
      <div className={`tour-card__grid ${!isImagesPresent && "hide"}`}>
        <div className="tour-card__grid__details">
          <span>
            <div className="tour-card__grid__details__label">Duration</div>
            <div className="tour-card__grid__details__value">{movingTime}</div>
          </span>
          <span>
            <div className="tour-card__grid__details__label">Cost</div>
            <div className="tour-card__grid__details__value">{cost ? `${cost}€` : "0€"}</div>
          </span>
          <span>
            <div className="tour-card__grid__details__label">Rating</div>
            <div className="tour-card__grid__details__value">
              <span>
                <StarIcon sx={{ fontSize: 18, color: "#E8E405" }} />
              </span>
              <span className="tour-card__grid__details__icon">
                <span>5.0</span>
                <span>4</span>
              </span>
            </div>
          </span>
        </div>
        <div className="tour-card__grid__username">
          <div className="tour-card__grid__username__img-div">
            <img src={profileImg?.url ? profileImg.url : noProfileImage} alt="Profile" />
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
            <div>Amazing tour</div>
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
