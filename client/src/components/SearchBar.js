import searchLogo from "../images/icons/search-svgrepo-com.svg";

import Loading from "./Loading";

const SearchBar = ({ searchInput, setSearchInput, search, isLoaded }) => {
  const handleKeyUpEnter = (e) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
      search();
    }
  };

  return (
    <div className="search-bar">
      <label htmlFor="search-bar" className="visually-hidden">
        Search Bar
      </label>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search something here"
        onKeyUp={handleKeyUpEnter}
        id="search-bar"
      />
      {!isLoaded && <Loading width={15} height={15} />}
      <button className="search-bar__btn">
        <img src={searchLogo} alt="Search icon" width={12} height={12} onClick={search} />
      </button>
    </div>
  );
};

export default SearchBar;
