import React, { useEffect, useState } from "react";
import { v4 } from "uuid";

import NewWaypoint from "./NewWaypoint";

const NewWaypoints = ({ form, setForm, handleViewpoints, handleViewpointsImages, closeOneViewpointImage }) => {
  const waypointsUI = [];
  for (const viewpointId in form.viewpoints) {
    const jsx = <NewWaypoint key={viewpointId} viewpointId={viewpointId} form={form} setForms={setForm} {...form.viewpoints[viewpointId]} handleViewpoints={handleViewpoints} handleViewpointsImages={handleViewpointsImages} closeOneViewpointImage={closeOneViewpointImage} />;
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
          title: "prova",
          type: "waypoint",
          description: "descrip",
          cost: "",
          images: [],
        },
      },
    });
  };

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
