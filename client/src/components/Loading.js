import React from "react";
import { CirclesWithBar } from "react-loader-spinner";

const Loading = () => {
  return (
    <div className="loading">
      <CirclesWithBar height="200" width="200" color="#4fa94d" visible={true} outerCircleColor="" innerCircleColor="" barColor="" ariaLabel="circles-with-bar-loading" />
    </div>
  );
};

export default Loading;
