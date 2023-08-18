import React, { useState, useContext } from "react";
import { Scrollama, Step } from "react-scrollama";
import { MapContext } from "../../App";
import "./Story.css";

import Introduction from "./Introduction";
import Background from "./Background";
import Importance from "./Importance";
import Problems from "./Problems";
import Causes from "./Causes";

import guards from "../../Data/crossing_locations.geo.json";

const Story = () => {
  const { map, setMap, crashes } = useContext(MapContext);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  //wait for most layers to load
  if (map && map.getSource("guards")) {
    const onStepEnter = (data) => {
      setCurrentStepIndex(data);

      if (data.data === 3) {
        map.getSource("guards").setData(guards);
        map.setPaintProperty("guards", "icon-opacity", [
          "match",
          ["get", "LAST NAME"],
          "VACANT",
          1,
          1,
        ]);
        map.setPaintProperty("guards_vacant", "icon-opacity", [
          "match",
          ["get", "LAST NAME"],
          "VACANT",
          0,
          0,
        ]);
      }
      if (data.data === 3) {
        map.flyTo({
          center: [-73.927, 40.860],
          zoom: 14.5,
        });
      }
      if (data.data > 3) {
        map.setPaintProperty("guards", "icon-opacity", [
          "match",
          ["get", "LAST NAME"],
          "VACANT",
          0,
          1,
        ]);
        map.setPaintProperty("guards_vacant", "icon-opacity", [
          "match",
          ["get", "LAST NAME"],
          "VACANT",
          1,
          0,
        ]);
      }
    };

    return (
      <div className="absolute left-[0px] top-0 px-[18px] text-white z-2">
        <Scrollama offset={0.5} onStepEnter={onStepEnter}>
          <Step data={1}>
            <div>
              <Introduction />
            </div>
          </Step>
          <Step data={2}>
            <div>
              <Background />
            </div>
          </Step>
          <Step data={3}>
            <div>
              <Importance />
            </div>
          </Step>
          <Step data={4}>
            <div>
              <Problems />
            </div>
          </Step>
          <Step data={5}>
            <div>
              <Causes />
            </div>
          </Step>
        </Scrollama>
      </div>
    );
  }

  return (
    <div className="absolute left-[0px] top-0 px-[18px] text-white  z-2">
      <div>
        <Introduction />
      </div>
    </div>
  );
};

export default Story;
