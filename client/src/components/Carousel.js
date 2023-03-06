import React, { useEffect } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Pagination, Scrollbar, A11y } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/thumbs";

import AuthorCard from "./AuthorCard";
import logoImg from "../images/logo-toors.png";
import crossIcon from "../images/icons/cross-svgrepo-com.svg";

const Carousel = ({ allImages, isModalOn, swiperRef, toggleModal, tourOwner, title }) => {
  const ipAdress = "http://localhost:5000/";

  return (
    <>
      <div className={`swiper-parent ${isModalOn ? "show" : ""}`}>
        <div className="swiper-main">
          <Swiper
            modules={[Thumbs, Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            // my parameters
            speed={1}
            loop={true}
            ref={swiperRef}
          >
            {allImages.map((image, index) => {
              return (
                <SwiperSlide key={index}>
                  <div className="swiper-main__slide">
                    <img src={ipAdress + image} alt="" className="swiper-main__img" />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div className="carousel__subsection">
          <div className="carousel__logo-img-div">
            <img src={logoImg} alt="logo image" className="carousel__logo-img" />
          </div>
          <div className="carousel__author">
            <AuthorCard tourOwner={tourOwner} />
          </div>
          <h2 className="carousel__title">Photos of {title} asodjqowidjoajsodjzxc pweqjoiasj asdjqwje ascjqwepj</h2>
        </div>
        <button onClick={toggleModal} className="swiper-parent__close-modal">
          <img src={crossIcon} alt="close icon" />
        </button>
      </div>
    </>
  );
};

export default Carousel;
