import React, { useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import StarIcon from "@mui/icons-material/Star";
import Rating from "@mui/material/Rating";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const TourCard = ({ title, image }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const rating = 3.7;
  const numOfReviews = 251;

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const ratingChanged = () => {};

  // Change the star rating with the material ui. For somewhat reason it didn't work. The half star didn't render properly
  return (
    <div className="card">
      <div className="card__header">
        <div className="card__header__transportation-favorite">
          <div>
            <span>
              <DirectionsWalkIcon />
            </span>
            <span>Walking</span>
          </div>
          <div className="card__header__favorites" onClick={toggleFavorite}>
            <span>Save to favorites</span>
            <span>{isFavorite ? <FavoriteIcon color="error" sx={{ fontSize: 25 }} /> : <FavoriteBorderIcon sx={{ fontSize: 25 }} />}</span>
          </div>
        </div>
        <h3 className="card__header__title">Title written here</h3>
        <h5 className="card__header__location">Location here</h5>
      </div>
      <div className="card__grid">
        <div className="card__grid__details">
          <span>
            <div className="card__grid__details__label">Duration</div>
            <div className="card__grid__details__value">7h</div>
          </span>
          <span>
            <div className="card__grid__details__label">Cost</div>
            <div className="card__grid__details__value">17.55€</div>
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
            <img src="http://localhost:5000/1662891623513sunrise.jpg" alt="" />
          </div>
          <div className="card__grid__username__name">raifun</div>
        </div>
        <div className="card__grid__main-image">
          <img src="http://localhost:5000/1662891623513sunrise.jpg" alt="" />
        </div>
        <div className="card__grid__secondary-image-1">
          <img src="http://localhost:5000/1662891623513sunrise.jpg" alt="" />
        </div>
        <div className="card__grid__secondary-image-2">
          <img src="http://localhost:5000/1662891623513sunrise.jpg" alt="" />
        </div>
      </div>
      <div className="card__info">
        <div className="card__info__desc">One of the nicest trips around. Coming from Rome, one passes Nepi, after which it is another 4 km to very comfortable parking. After approx. 2 km, the trail dips into a thick forest, and follows a small...</div>
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
