import React from "react";
import { v4 } from "uuid";

import NewWaypoint from "./NewWaypoint";

const NewWaypoints = ({ form, setForm, handleViewpoints, handleViewpointsImages, closeOneViewpointImage, ignoreScroll }) => {
  const waypointsUI = [];
  for (const viewpointId in form.viewpoints) {
    const jsx = (
      <NewWaypoint
        {...{
          deleteWaypoint,
          viewpointId,
          form,
          handleViewpoints,
          handleViewpointsImages,
          closeOneViewpointImage,
          key: viewpointId,
          setForms: setForm,
          ignoreScroll,
        }}
        {...form.viewpoints[viewpointId]}
      />
    );
    waypointsUI.push(jsx);
  }

  const createNewWaypoint = (e) => {
    e.preventDefault();
    const id = v4();
    setForm({
      ...form,
      viewpoints: {
        ...form.viewpoints,
        [id]: {
          title: "",
          type: "waypoint",
          description: "",
          cost: "",
          images: [],
        },
      },
    });
  };

  function deleteWaypoint(e, id) {
    e.preventDefault();
    const viewpointsCopy = {};
    for (const key in form.viewpoints) {
      if (Object.hasOwnProperty.call(form.viewpoints, key)) {
        const element = form.viewpoints[key];
        viewpointsCopy[key] = { ...element };
      }
    }
    delete viewpointsCopy[id];

    setForm({
      ...form,
      viewpoints: viewpointsCopy,
    });
  }

  return (
    <div className="new-waypoints">
      {waypointsUI}
      <button className="create-waypoint-btn" onClick={createNewWaypoint}>
        +
      </button>
    </div>
  );
};

export default NewWaypoints;
