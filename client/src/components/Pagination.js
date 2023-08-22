import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTourFilters } from "../actions/tours";

const Pagination = ({ currentPage, postsPerPage, setCurrentPage, totalTours }) => {
  const filters = useSelector((state) => state.tours.filters);
  const dispatch = useDispatch();

  const totalPages = Math.ceil(totalTours / postsPerPage);

  const pages = calculatePagesToShow();

  function calculatePagesToShow() {
    const pages = [];
    const maxPages = 5;
    let newPagesCount = 1;
    let pagesCount = 1;
    let start = currentPage;
    let end = currentPage;

    while (pagesCount < maxPages) {
      if (end + 1 <= totalPages) {
        // Ok to take one more page towards end
        end++;
        newPagesCount++;
      }

      if (start - 1 > 0) {
        //Ok to take one more page towards start
        start--;
        newPagesCount++;
      }

      /* 
       Break loop if no additional pages were obtained in this iteration
       We have obtained maximum number of possible pages
      */
      if (newPagesCount == pagesCount) break;
      else pagesCount = newPagesCount;
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  const changePage = async (elem) => {
    const pagLimit = 10;

    // When this action fires and pagSkip changes, applyFilters() function in the Home component will fire.
    dispatch(setTourFilters({ pagSkip: pagLimit * (Number(elem) - 1) }));
    setCurrentPage(elem);
    window.scrollTo({ top: 0, left: 0 });
  };

  return (
    <div className="pagination">
      <button onClick={() => changePage(currentPage - 1)} className={`pagination__btn ${currentPage === 1 && "none"}`}>
        &lt;
      </button>
      {pages.map((elem, index) => {
        return (
          <button onClick={() => changePage(elem)} className={`pagination__btn ${elem === currentPage && "pagination__current"}`} key={index}>
            {elem}
          </button>
        );
      })}
      <button onClick={() => changePage(currentPage + 1)} className={`pagination__btn ${currentPage === totalPages && "none"}`}>
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
