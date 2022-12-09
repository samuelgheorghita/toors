import React, { useState } from "react";

const Filters = ({ filters, setFilters }) => {
  const transportationWays = ["car", "walking", "public transportation", "boat"];
  const [isChecked, setIsChecked] = useState(new Array(transportationWays.length).fill(false));

  console.log(isChecked);
  console.log(transportationWays);

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

  // <div className=".filters__group__checkbox">
  //   <input type="checkbox" name={elem} value={elem} id={`transportation-checkbox-${index}`} checked={isChecked[index]} onChange={() => handleCheckboxes(index)} />
  //   <label htmlFor={`transportation-checkbox-${index}`}>{elem}</label>
  // </div>;

  return (
    <div className="filters">
      <div className="filters__group">
        <h5>Transportation</h5>
        {transportationWays.map((elem, index) => {
          return (
            <label className="filters__group__checkbox">
              {elem}
              <input type="checkbox" name={elem} value={elem} id={`transportation-checkbox-${index}`} checked={isChecked[index]} onChange={() => handleCheckboxes(index)} />
              <span className="checkmark"></span>
            </label>
          );
        })}
      </div>
      <div>a bunch of filter</div>
      <div>a bunch of filter</div>
      <div>a bunch of filter</div>
      <div>a bunch of filter</div>
    </div>
  );
};

export default Filters;
