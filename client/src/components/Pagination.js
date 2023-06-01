import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTourFilters } from "../actions/tours";

const Pagination = ({ currentPage, postsPerPage, setCurrentPage, totalTours }) => {
  const filters = useSelector((state) => state.tours.filters);
  const dispatch = useDispatch();

  const pages = [];
  for (let i = 1; i <= Math.ceil(totalTours / postsPerPage); i++) {
    pages.push(i);
  }

  const changePage = async (elem) => {
    const pagLimit = 10;

    console.log(pagLimit * (Number(elem) - 1));

    // When this action fires and pagSkip changes, applyFilters() function in the Home component will fire.
    dispatch(setTourFilters({ pagSkip: pagLimit * (Number(elem) - 1) }));
    setCurrentPage(elem);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <div className="pagination">
      {pages.map((elem, index) => {
        return (
          <button onClick={() => changePage(elem)} className={`pagination__btn ${index + 1 === currentPage && "pagination__current"}`} key={index}>
            {elem}
          </button>
        );
      })}
    </div>
  );
};

export default Pagination;

// className={`${index +1 === currentPage && "pagination__current"}`}
