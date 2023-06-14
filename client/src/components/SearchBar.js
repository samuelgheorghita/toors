import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import searchLogo from "../images/icons/search-svgrepo-com.svg";

import { setTourFilters } from "../actions/tours";
import { useNavigate } from "react-router-dom";
import { prePath } from "../apis/globalApi";

const SearchBar = () => {
  const [inputState, setInputState] = useState("");
  const filters = useSelector((state) => state.tours.filters);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
      search();
    }
  };

  const search = () => {
    dispatch(setTourFilters({ searchStr: inputState })); // dispatch the action creator function
    navigate(`/${prePath}`);
  };

  return (
    <div className="search-bar">
      <label htmlFor="search-bar" className="visually-hidden">
        Search Bar
      </label>
      <input
        type="text"
        value={inputState}
        onChange={(e) => setInputState(e.target.value)}
        placeholder="Search something here"
        onKeyUp={handleKeyUp}
        id="search-bar"
      />
      <button className="search-bar__btn">
        <img src={searchLogo} alt="Search icon" width={12} height={12} onClick={search} />
      </button>
    </div>
  );
};

export default SearchBar;
