import React from "react";
import { ipAdress } from "../api";

const AuthorCard = ({ tourOwner }) => {
  return (
    <div className="author-card">
      <div className="author-card__img-container">
        <img src={ipAdress + tourOwner?.profileImg} alt="Profile Image" />
      </div>
      <div className="author-card__label">Author</div>
      <div className="author-card__name">{tourOwner?.username}</div>
    </div>
  );
};

export default AuthorCard;
