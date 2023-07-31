import React from "react";
import noProfileImage from "../images/no-profile-image.png";

const AuthorCard = ({ tourOwner }) => {
  return (
    <div className="author-card">
      <div className="author-card__img-container">
        <img src={tourOwner.profileImg?.url ? tourOwner.profileImg.url : noProfileImage} alt="Profile" />
      </div>
      <div className="author-card__label">Author</div>
      <div className="author-card__name">{tourOwner?.username}</div>
    </div>
  );
};

export default AuthorCard;
