import React, { useEffect } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Thumbs, Pagination, Scrollbar, A11y } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/thumbs";

import AuthorCard from "./AuthorCard";
import logoImg from "../images/logo-toors.png";

const Carousel = ({ allImages, isModalOn, swiperRef, thumbsSwiper, setThumbsSwiper, toggleModal, tourOwner }) => {
  const ipAdress = "http://localhost:5000/";

  return (
    <>
      <div className={`swiper-parent ${isModalOn && "show"}`}>
        <div className="swiper-main">
          <Swiper
            modules={[Thumbs, Navigation, Pagination, Scrollbar, A11y]}
            thumbs={{ swiper: thumbsSwiper }}
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
                  <div className="swiper-main__img-div">
                    <img src={ipAdress + image} alt="" className="swiper-main__img" />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div className="carousel__subsection">
          <div className="carousel__subsection-left"></div>
          <div className="carousel__subsection-right"></div>
        </div>
        <AuthorCard tourOwner={tourOwner} />
        <div className="swiper-thumb">
          <Swiper modules={[Thumbs]} watchSlidesProgress onSwiper={setThumbsSwiper} spaceBetween={10} slidesPerView={10}>
            {allImages.map((image, index) => {
              return (
                <SwiperSlide key={index}>
                  <img src={ipAdress + image} alt="" className="swiper-thumb__img" />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <button onClick={toggleModal} className="swiper-parent__close-modal">
          CLOSE MODAL
        </button>
      </div>
    </>
  );
};

export default Carousel;
