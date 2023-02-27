import React, { useState } from "react";
import { useSelector } from "react-redux";

const ReadMore = ({ length, text }) => {
  const [isAllTextShown, setIsAllTextShown] = useState(false);

  let textShown = text;
  const wordsInText = text.split(" ").length;

  if (!isAllTextShown && wordsInText > length) {
    textShown = text.split(" ").slice(0, length).join(" ");
  }

  const handleChange = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsAllTextShown(!isAllTextShown);
  };

  return (
    <div className="read-more-component">
      <div className="read-more-component__text">
        {textShown}
        <a href="" onClick={handleChange}>
          {wordsInText > length && (isAllTextShown ? "Read less" : "...Read more")}
        </a>
      </div>
    </div>
  );
};

export default ReadMore;
