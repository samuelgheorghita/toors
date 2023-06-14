import React from "react";
import { Link } from "react-router-dom";
import { prePath } from "../apis/globalApi";

const Error = () => {
  return (
    <div className="error">
      <h1>Nothing is here</h1>
      <Link to={`/${prePath}/`} className="link">
        Go Back home
      </Link>
    </div>
  );
};

export default Error;
