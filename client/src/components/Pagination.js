import React from "react";

const Pagination = ({ postsPerPage, setCurrentPage, totalPosts }) => {
  const pages = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pages.push(i);
  }

  const changePage = (elem) => {
    setCurrentPage(elem);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <div className="pagination">
      {pages.map((elem, index) => {
        return (
          <button onClick={() => changePage(elem)} key={index}>
            {elem}
          </button>
        );
      })}
    </div>
  );
};

export default Pagination;
