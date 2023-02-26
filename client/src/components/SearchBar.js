import React, { useState } from "react";
import { useDispatch } from "react-redux";
import searchLogo from "../images/icons/search-svgrepo-com.svg";

import { getAllToursWithFilters } from "../actions/tours";

const SearchBar = () => {
  const [inputState, setInputState] = useState("");

  const dispatch = useDispatch();

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  const search = () => {
    console.log(inputState);
    if (inputState) {
      dispatch(getAllToursWithFilters(inputState)); // dispatch the action creator function
    } else {
      // normal getAllTours without any search filters (but yes to normal filters)
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={inputState}
        onChange={(e) => setInputState(e.target.value)}
        placeholder="Search something here"
        onKeyUp={handleKeyUp}
      />
      <button className="search-bar__btn">
        <img src={searchLogo} alt="" width={12} height={12} onClick={search} />
      </button>
    </div>
  );
};

export default SearchBar;
