import React, { useState, useContext } from "react";
import { Scrollama, Step } from "react-scrollama";
import { MapContext } from "../../App";
import "./Story.css";

import * as turf from "@turf/turf";

import Introduction from "./Introduction";
import Background from "./Background";
import Importance from "./Importance";
import Problems from "./Problems";
import Causes from "./Causes";

import guards from "../../Data/crossing_locations.geo.json";

console.log(guards);

const Story = () => {
  const { map, setMap, crashes } = useContext(MapContext);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const bufferPoints = guards.features.reduce((bufferPoints, feature) => {
    if (feature.properties["LAST NAME"] === "VACANT") {
      bufferPoints.push(
        turf.buffer(turf.point(feature.geometry.coordinates), 80, {
          units: "meters",
        })
      );
    }

    return bufferPoints;
  }, []);

  console.log(bufferPoints);

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
        map.flyTo({
          center: [-73.927, 40.86],
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
      if (data.data === 5) {
        map.setPaintProperty("guards", "icon-opacity", [
          "match",
          ["get", "LAST NAME"],
          "VACANT",
          0,
          0,
        ]);

        //   bufferPoints.forEach((b, i) => {
        //     map.addSource(`vacant-buffer-${i}`, {
        //       type: "geojson",
        //       data: {
        //         type: "FeatureCollection",
        //         features: [bufferPoints[i]],
        //       },
        //     });
        //     map.addLayer({
        //       id: `vacant-outline-${i}`,
        //       type: "line",
        //       source: `vacant-buffer-${i}`,
        //       layout: {
        //         "line-cap": "round",
        //       },
        //       paint: {
        //         "line-color": "#fdeca6",
        //         "line-width": 3,
        //         "line-dasharray": [0, 2],
        //       },
        //     });
        //   });
        // }
        // if (data.data !== 5 && map.getSource(`vacant-buffer-24`)) {
        //   bufferPoints.forEach((b, i) => {
        //     map.removeSource(`vacant-buffer-${i}`);
        //     map.removeLayer(`vacant-outline-${i}`);
        //   });
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
