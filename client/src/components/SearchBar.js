import React, { useState } from "react";

const SearchBar = () => {
  const [inputState, setInputState] = useState("");
  return (
    <div className="search-bar">
      <h5>Search</h5>
      <input type="text" value={inputState} onChange={(e) => setInputState(e.target.value)} />
    </div>
  );
};

export default SearchBar;
