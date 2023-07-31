import React from "react";
import { Link } from "react-router-dom";
import { prePathS } from "../apis/globalApi";

const Error = () => {
  return (
    <div className="error">
      <h1>Nothing is here</h1>
      <Link to={`${prePathS}/`} className="link">
        Go Back home
      </Link>
    </div>
  );
};

export default Error;
