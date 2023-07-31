import React from "react";
import { useParams } from "react-router-dom";

import AddTour from "./AddTour";

const EditTour = () => {
  const id = useParams().id;

  return (
    <div className="edit-tour-page">
      <AddTour id={id} />
    </div>
  );
};

export default EditTour;
