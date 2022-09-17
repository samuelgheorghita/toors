import React from "react";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="error">
      <h1>Nothing is here</h1>
      <Link to="/" className="link">
        Go Back home
      </Link>
    </div>
  );
};

export default Error;
