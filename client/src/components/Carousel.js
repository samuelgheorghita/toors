import React, { useEffect } from "react";
import { useBeforeUnload } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Thumbs, Pagination, Scrollbar, A11y } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/thumbs";

import { useLocation } from "react-router-dom";

const Carousel = ({ allImages, isModalOn, swiperRef, thumbsSwiper, setThumbsSwiper, toggleModal }) => {
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
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log("slide change")}
            // my parameters
            speed={1}
            loop={true}
            ref={swiperRef}
          >
            {allImages.map((image, index) => {
              console.log(image);
              return (
                <SwiperSlide key={index}>
                  <img src={ipAdress + image} alt="" className="swiper-main__img" />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div className="swiper-thumb">
          <Swiper modules={[Thumbs]} watchSlidesProgress onSwiper={setThumbsSwiper} spaceBetween={10} slidesPerView={10}>
            {allImages.map((image, index) => {
              console.log(image);
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
