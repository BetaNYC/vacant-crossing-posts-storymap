import React, { useState, useContext } from "react";

import { MapContext } from "../../App";
import { getStackCrashes } from "./getStackCrashes";

const TimeSelect = () => {
  const { map, crashes } = useContext(MapContext);
  const [timePeriod, setTimePeriod] = useState("all");

  const selectChangeHandler = (timePeriod) => {
    setTimePeriod(timePeriod);

    let fileredCrashes = [];

    switch (timePeriod) {
      case "morning":
        fileredCrashes = crashes.filter(
          (d) => d.properties.hour >= 7 && d.properties.hour <= 10
        );
        break;
      case "afternoon":
        fileredCrashes = crashes.filter(
          (d) => d.properties.hour >= 13 && d.properties.hour <= 16
        );
        break;
      default:
        fileredCrashes = crashes;
        break;
    }

    map.getSource("crashes").setData({
      type: "FeatureCollection",
      features: getStackCrashes(fileredCrashes),
    });
  };

  return (
    <select
      className="fixed right-[20px] top-[40px] px-[14px] py-[5px] text-[20px] text-white bg-[rgba(0,0,0,0.5)] rounded-[3px]"
      onChange={(e) => selectChangeHandler(e.target.value)}
    >
      <option value="all">All</option>
      <option value="morning">Morning</option>
      <option value="afternoon">Afternoon</option>
    </select>
  );
};

export default TimeSelect;
