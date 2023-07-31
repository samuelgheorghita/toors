import React from "react";
import { ThreeDots, CirclesWithBar } from "react-loader-spinner";

const Loading = ({ width = 80, height = 80, addClass }) => {
  return (
    <div className={`loading ${addClass}`}>
      <ThreeDots
        height={height}
        width={width}
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
