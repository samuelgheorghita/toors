import React, { useState } from "react";
import { useSelector } from "react-redux";

const ReadMore = ({ text }) => {
  const [isAllTextShown, setIsAllTextShown] = useState(false);
  const user = useSelector((state) => state.users.user);

  let textShown = text;
  let date = "";

  if (!isAllTextShown && text.split(" ").length > 50) {
    textShown = text.split(" ").slice(0, 50).join(" ");
  }

  if (user.createdAt) {
    date = new Date(user.createdAt).toLocaleString("default", { month: "long", year: "numeric" });
  }

  return (
    <div className="read-more-component">
      <div className="text">
        {textShown}
        <a href="#" onClick={() => setIsAllTextShown(!isAllTextShown)}>
          {isAllTextShown ? "Read less" : "...Read more"}
        </a>
      </div>
      {date && <div className="creation">{"Member since " + date}</div>}
    </div>
  );
};

export default ReadMore;
