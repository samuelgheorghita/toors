import React, { useState } from "react";

const Filters = ({ applyFilters, filters, setFilters }) => {
  const transportationWays = ["car", "walking", "public transportation", "boat"];
  const [isChecked, setIsChecked] = useState(new Array(transportationWays.length).fill(false));

  const handleCheckboxes = (position) => {
    const updatedIsChecked = isChecked.map((item, index) => (index === position ? !item : item));
    setIsChecked(updatedIsChecked);

    const updatedTransportationFilters = [];
    updatedIsChecked.forEach((elem, index) => {
      if (elem === true) {
        updatedTransportationFilters.push(transportationWays[index]);
      }
    });
    setFilters({ ...filters, transportation: updatedTransportationFilters });
  };

  const handleInputs = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  console.log(filters);

  return (
    <div className="filters">
      <div className="filters__group">
        <h2>Filters</h2>
        <h3>Transportation</h3>
        <form action="">
          {transportationWays.map((elem, index) => {
            return (
              <label className="filters__group__checkbox" key={index}>
                {elem}
                <input
                  type="checkbox"
                  name={elem}
                  value={elem}
                  id={`transportation-checkbox-${index}`}
                  checked={isChecked[index]}
                  onChange={() => handleCheckboxes(index)}
                />
                <span className="checkmark"></span>
              </label>
            );
          })}

          <div className="filters__group">
            <h3>Cost</h3>
            <label htmlFor="costMin" className="visually-hidden">
              Minimum Cost
            </label>
            <input type="number" placeholder="Min (€)" name="costMin" value={filters.costMin} onChange={handleInputs} id="costMin" />
            <label htmlFor="costMax" className="visually-hidden">
              Maximum cost
            </label>
            <input type="number" placeholder="Max (€)" name="costMax" value={filters.costMax} onChange={handleInputs} id="costMax" />
          </div>
          <button onClick={applyFilters} className="navbar-btn">
            Apply filters
          </button>
        </form>
      </div>
    </div>
  );
};

export default Filters;
