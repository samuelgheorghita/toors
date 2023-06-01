import React from "react";
import { CirclesWithBar, ThreeDots } from "react-loader-spinner";

const Loading = () => {
  return (
    <div className="loading">
      {/* <CirclesWithBar
        height="200"
        width="200"
        color="#4fa94d"
        visible={true}
        outerCircleColor=""
        innerCircleColor=""
        barColor=""
        ariaLabel="circles-with-bar-loading"
      /> */}
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="#ff385c"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      />
    </div>
  );
};

export default Loading;
