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

  return (
    <div className="filters">
      <div className="filters__group">
        <h2>Filters</h2>
        <h5>Transportation</h5>
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
      </div>
      <div className="filters__group">
        <h5>Cost</h5>
        <input type="number" placeholder="Min (€)" name="costMin" value={filters.costMin} onChange={handleInputs} />
        <input type="number" placeholder="Max (€)" name="costMax" value={filters.costMax} onChange={handleInputs} />
      </div>
      <button onClick={applyFilters} className="navbar-btn">
        Apply filters
      </button>
    </div>
  );
};

export default Filters;
