import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/thumbs";

import AuthorCard from "./AuthorCard";
import logoImg from "../images/logo-toors.png";
import crossIcon from "../images/icons/cross-svgrepo-com.svg";
import { prePathS } from "../apis/globalApi";
import { handleTabKey } from "../tools/functions/functions";

const Carousel = ({ allImages, isModalOn, setIsModalOn, swiperRef, toggleModal, tourOwner, title }) => {
  const swiperParentRef = useRef(null);

  useEffect(() => {
    const keyPress = (e) => {
      if (!isModalOn) return;

      if (e.key === "ArrowRight") {
        // Next image
        // swiper.slideNext();
        const after = swiperRef.current.swiper.slideNext();
      } else if (e.key === "ArrowLeft") {
        // Previous image
        // swiper.slidePrev();
        swiperRef.current.swiper.slidePrev();
      } else if (e.key === "Escape") {
        toggleModal();
      } else if (e.key === "Tab") {
        handleTabKey(e, swiperParentRef);
      }
    };

    window.addEventListener("keyup", keyPress);
    return () => window.removeEventListener("keyup", keyPress);
  });

  return (
    <>
      <div className={`swiper-parent ${isModalOn ? "show" : ""}`} ref={swiperParentRef}>
        <button onClick={toggleModal} className="swiper-parent__close-modal">
          <img src={crossIcon} alt="close icon" />
        </button>
        <div className="swiper-main">
          <Swiper
            modules={[Navigation]}
            slidesPerView={1}
            navigation
            // my parameters
            speed={1}
            loop={true}
            ref={swiperRef}
          >
            {allImages.map((image, index) => {
              return (
                <SwiperSlide key={index}>
                  <div className="swiper-main__slide">
                    <img src={image.url} alt="User uploaded" className="swiper-main__img" />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div className="carousel__subsection">
          <Link to={`${prePathS}`}>
            <div className="carousel__logo-img-div">
              <img src={logoImg} alt="logo" className="carousel__logo-img" />
            </div>
          </Link>
          <div className="carousel__author">
            <AuthorCard tourOwner={tourOwner} />
          </div>
          <h2 className="carousel__title">Photos of "{title}"</h2>
        </div>
      </div>
    </>
  );
};

export default Carousel;
