import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import Rating from "@mui/material/Rating";
import FlagIcon from "@mui/icons-material/Flag";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";

import Loading from "../components/Loading";
import Weather from "../components/Weather";
import AuthorCard from "../components/AuthorCard";
import DeleteModal from "../components/modals/DeleteModal";
import Carousel from "../components/Carousel";
import { isoDateToMonthAndYear } from "../tools/functions/functions";
import * as api from "../apis";
import ShareModal from "../components/modals/ShareModal";
import { prePathS } from "../apis/globalApi";
import useToggleIsFavorite from "../tools/hooks/useToggleIsFavorite";

// COMPONENT
const SingleTourPage = () => {
  const [tour, setTour] = useState(null);
  const [tourOwner, setTourOwner] = useState(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isModalOn, setIsModalOn] = useState(false);
  const [isDeleteConfirmOn, setIsDeleteConfirmOn] = useState(false);
  const [isShareModalOn, setIsShareModalOn] = useState(false);
  const [viewAllImgs, setViewAllImgs] = useState(false);
  const username = useSelector((state) => state.users.username);
  const reduxFavorites = useSelector((state) => state.users?.favorites);
  const isFavorite = reduxFavorites?.includes(tour?._id);

  const swiperRef = useRef(null);

  const id = useParams().id;

  const isTourMine = username === tourOwner?.username;
  const allImages = [];
  const { switchFavorites } = useToggleIsFavorite();
  const navigate = useNavigate();

  if (tour) {
    tour.images.forEach((image) => allImages.push(image));
    tour.viewpoints.forEach((viewpoint) => {
      viewpoint.images.forEach((image) => allImages.push(image));
    });
  }

  const imagesToShow = viewAllImgs ? allImages : allImages.slice(0, 6);

  useEffect(() => {
    const fetchData = async () => {
      const tour = await api.getSingleTour(id);
      setTour(tour);

      const tourOwner = await api.getAuthorByUsername(tour.createdBy);
      setTourOwner(tourOwner);

      setIsPageLoaded(true);
    };

    fetchData().catch((err) => {
      console.log(err);
      navigate(`${prePathS}/users/login`);
    });
  }, []);

  const toggleModal = () => {
    // Disable/Enable Scrollbar --- Checking previous state... This means now clicking in order to CLOSE the modal
    if (isModalOn) {
      document.body.style.overflow = "unset";
    } else {
      // Now clicking to OPEN the modal
      document.body.style.overflow = "hidden";
    }

    setIsModalOn(!isModalOn);
  };

  const openModalThroughImages = (image) => {
    const index = allImages.indexOf(image);

    swiperRef.current.swiper.slideToLoop(index, 1, false);

    toggleModal();
  };

  // main if/else starts here
  if (isPageLoaded && allImages) {
    const deleteTour = async () => {
      try {
        await api.deleteTour(id);
        navigate(`${prePathS}`);
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <>
        <Carousel {...{ allImages, setIsModalOn, isModalOn, swiperRef, toggleModal, tourOwner, title: tour.title }} />

        <div className="single-tour-page">
          <div className="title-and-btns">
            <h1 className="title">{tour.title}</h1>
            <div className="tools">
              <div className="tools__one">
                <button disabled>
                  <span className="icon">
                    <ChatBubbleOutlineIcon
                      sx={{
                        fontSize: 14,
                      }}
                    />
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
              <div className="tools__two">
                {isTourMine && (
                  <>
                    <button className="tools__two__btn" onClick={() => navigate(`${prePathS}/tours/edit-tour/${id}`)}>
                      <span className="icon">
                        <EditIcon
                          sx={{
                            fontSize: 14,
                          }}
                        />
                      </span>
                      <span className="label">Edit</span>
                    </button>
                    <button onClick={() => setIsDeleteConfirmOn(true)}>
                      <span className="icon">
                        <DeleteOutlinedIcon
                          sx={{
                            fontSize: 14,
                          }}
                        />
                      </span>
                      <span className="label">Delete</span>
                    </button>
                  </>
                )}
                <button onClick={() => switchFavorites(id)}>
                  <span className="icon">
                    {isFavorite ? (
                      <FavoriteIcon
                        sx={{
                          fontSize: 14,
                        }}
                      />
                    ) : (
                      <FavoriteBorderIcon
                        sx={{
                          fontSize: 14,
                        }}
                      />
                    )}
                  </span>
                  <span className="label">Save to Favorites</span>
                </button>
                <button onClick={() => setIsShareModalOn(true)}>
                  <span className="icon">
                    <ShareIcon
                      sx={{
                        fontSize: 14,
                      }}
                    />
                  </span>
                  <span className="label">Share</span>
                </button>
              </div>
            </div>
          </div>

          <div className="main-sidebar-container">
            <div className="main">
              <div className="description">{tour.description}</div>

              <div className="waypoints">
                {tour.viewpoints.map((waypoint) => {
                  return (
                    <div className="waypoint" key={waypoint.id}>
                      <div className="waypoint__info">
                        <span className="waypoint__info__icon">
                          <FlagIcon
                            sx={{
                              fontSize: 30,
                            }}
                          />
                        </span>
                        <span className="waypoint__info__type">{waypoint.type}</span>
                        {/* TODO: once you changed all the tours price to cost, then change the following line */}
                        <span className="waypoint__info__cost">{waypoint.cost}€</span>
                        <div className="waypoint__info__title">{waypoint.title}</div>
                      </div>
                      <div className="images-description">
                        <span className="images-flex">
                          {waypoint.images.map((image) => {
                            return (
                              <div className="img-container" onClick={() => openModalThroughImages(image)} key={image.name}>
                                <img src={image.url} alt="Waypoint" />
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
            {/* SIDEBAR */}
            <div className="sidebar">
              <AuthorCard tourOwner={tourOwner} />
              <div className="sidebar__details">
                <div className="sidebar__details__group">
                  <div className="sidebar__details__group__label">Cost</div>
                  <div className="sidebar__details__group__value">{tour.cost} €</div>
                </div>
                <div className="sidebar__details__group">
                  <div className="sidebar__details__group__label">Transportation</div>
                  <div className="sidebar__details__group__value">public transp.</div>
                </div>
                <div className="sidebar__details__group">
                  <div className="sidebar__details__group__label">Moving Time</div>
                  <div className="sidebar__details__group__value">{tour.movingTime} h</div>
                </div>
                <div className="sidebar__details__group">
                  <div className="sidebar__details__group__label">Total Time</div>
                  <div className="sidebar__details__group__value">{tour.totalTime} h</div>
                </div>
              </div>
              <div className="sidebar__images-wrapper">
                <div className="sidebar__images">
                  {imagesToShow.map((image) => {
                    return (
                      <div onClick={() => openModalThroughImages(image)} key={image.name}>
                        <img src={image.url} alt="General" />
                      </div>
                    );
                  })}
                </div>
                <button className={`sidebar__more-photos-btn`} onClick={() => setViewAllImgs(!viewAllImgs)}>
                  {viewAllImgs ? "View less photos..." : "View more photos..."}
                </button>
              </div>

              <div className="sidebar__details2">
                <div className="sidebar__details2__label">Location</div>
                <div className="sidebar__details2__value">{tour.location}</div>
                <div className="sidebar__details2__label">Created</div>
                <div className="sidebar__details2__value">{isoDateToMonthAndYear(tour.createdAt)}</div>
                <div className="sidebar__details2__label">Updated</div>
                <div className="sidebar__details2__value">{isoDateToMonthAndYear(tour.updatedAt)}</div>
              </div>
              <Weather location={tour.location} />
            </div>
          </div>
        </div>

        <ShareModal onClose={() => setIsShareModalOn(false)} show={isShareModalOn} />

        <DeleteModal title="Delete" onClose={() => setIsDeleteConfirmOn(false)} onDelete={deleteTour} show={isDeleteConfirmOn}>
          <p>Are you sure you want to this tour?</p>
        </DeleteModal>
      </>
    );
  } else {
    return <Loading />;
  }
};

export default SingleTourPage;
