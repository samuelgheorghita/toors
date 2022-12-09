import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import Rating from "@mui/material/Rating";
import FlagIcon from "@mui/icons-material/Flag";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Thumbs } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/thumbs";

import * as api from "../api";
import Loading from "../components/Loading";
import logoImg from "../images/logo-toors.png";
import Weather from "../components/Weather";

// COMPONENT
const SingleTourPage = () => {
  const [tour, setTour] = useState(null);
  const [user, setUser] = useState(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isModalOn, setIsModalOn] = useState(false);
  const [swiper, setSwiper] = useState(null);
  const [activeThumb, setActiveThumb] = useState(null);
  const [indexOfCurrImg, setIndexOfCurrImg] = useState(1);
  const id = useParams().id;
  const username = useSelector((state) => state.users.username);

  // TODO: delete this state after you implement favorites in backend
  const [isFavorite, setIsFavorite] = useState(false);

  const ipAdress = "http://localhost:5000/";
  const allImages = [];

  swiper?.slideTo(indexOfCurrImg);

  if (tour) {
    tour.images.forEach((image) => allImages.push(image));
    tour.viewpoints.forEach((viewpoint) => {
      viewpoint.images.forEach((image) => allImages.push(image));
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      const tourApi = await api.getSingleTour(id);
      setTour(tourApi);

      const user = await api.getUserByUsername(username);
      setUser(user);

      setIsPageLoaded(true);
      console.log(tourApi);
    };

    fetchData().catch((err) => console.log(err));
  }, []);

  // main if/else starts here
  if (isPageLoaded && allImages) {
    const allImagesUI = allImages.map((image, index) => {
      return (
        <SwiperSlide key={index} className="swiper-slide">
          <img src={ipAdress + image} alt="Slider Images" />
        </SwiperSlide>
      );
    });

    const toggleModal = () => {
      setIsModalOn(!isModalOn);
    };

    const openModalThroughImages = (image) => {
      let index = allImages.indexOf(image);
      index++;
      setIndexOfCurrImg(index);
      swiper?.slideTo(indexOfCurrImg);

      toggleModal();
    };

    return (
      <>
        <div className="single-tour-page">
          <div className="main">
            <h1 className="title">{tour.title}</h1>
            <div className="tools">
              <div className="tools__one">
                <button>
                  <span className="icon">
                    <ChatBubbleOutlineIcon sx={{ fontSize: 14 }} />
                  </span>
                  <span className="label">Comment</span>
                </button>

                <span className="rating">
                  <span>4 comments</span>
                  <span>
                    <Rating name="read-only" value={5} readOnly size="small" />
                  </span>
                </span>
              </div>
              <div className="tools_two">
                <button>
                  <span className="icon">{isFavorite ? <FavoriteIcon sx={{ fontSize: 14 }} /> : <FavoriteBorderIcon sx={{ fontSize: 14 }} />}</span>
                  <span className="label">Save to Favorites</span>
                </button>
                <button>
                  <span className="icon">
                    <ShareIcon sx={{ fontSize: 14 }} />
                  </span>
                  <span className="label">Share</span>
                </button>
              </div>
            </div>
            <div className="description">{tour.description}</div>

            <div className="waypoints">
              {tour.viewpoints.map((waypoint) => {
                return (
                  <div className="waypoint" key={v4()}>
                    <div className="waypoint__info">
                      <span className="waypoint__info__icon">
                        <FlagIcon sx={{ fontSize: 30 }} />
                      </span>
                      <span className="waypoint__info__type">{waypoint.type}</span>
                      <span className="waypoint__info__price">{waypoint.price}€</span>
                      <div className="waypoint__info__title">{waypoint.title}</div>
                    </div>
                    <div className="images-description">
                      <span className="images-flex">
                        {waypoint.images.map((image, index) => {
                          return (
                            <div className="img-container" onClick={() => openModalThroughImages(image)} key={v4()}>
                              <img src={ipAdress + image} alt="" />
                            </div>
                          );
                        })}
                      </span>
                      <span className="description">{waypoint.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="sidebar">
            <div className="sidebar__images">
              {allImages.map((image) => {
                return (
                  <div onClick={() => openModalThroughImages(image)} key={image}>
                    <img src={ipAdress + image} alt="" />
                  </div>
                );
              })}
            </div>
            <Weather location={tour.location} />
          </div>
        </div>

        <div className={`img-slider${isModalOn ? "-active" : ""}`}>
          <Swiper modules={[Navigation, EffectFade, Thumbs]} thumbs={{ swiper: activeThumb }} onSwiper={setSwiper} speed={0} navigation={true} slidesPerView={1} loop className="my-swiper">
            {allImagesUI}
          </Swiper>
          <div className="logo-img-container">
            <img src={logoImg} alt="Logo Image" />
          </div>
          <div className="author-swiper-container">
            <div className="author-swiper-container__author">
              <div className="author-swiper-container__author__img-container">
                <img src={ipAdress + user.profileImg} alt="Profile Image" />
              </div>
              <div className="author-swiper-container__author__label">Author</div>
              <div className="author-swiper-container__author__name">{username}</div>
            </div>
            <Swiper modules={[Navigation, EffectFade, Thumbs]} onSwiper={setActiveThumb} slidesPerView={10} spaceBetween={10} className="swiper-thumbs">
              {allImages.map((image, index) => {
                return (
                  <SwiperSlide key={index}>
                    <div className="swiper-thumbs__img-container">
                      <img src={ipAdress + image} alt="Slider Images" />
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

          <button className="close-btn" onClick={toggleModal}>
            <CloseIcon sx={{ fontSize: 36, color: "#FFFFFF" }} />
          </button>
        </div>
      </>
    );
  } else {
    return <Loading />;
  }
};

export default SingleTourPage;
