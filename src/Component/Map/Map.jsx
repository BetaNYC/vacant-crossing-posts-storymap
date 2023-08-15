import React, { useState, useRef, useEffect, useContext } from "react";
import { MapContext } from "../../App";

import mapboxgl from "mapbox-gl";
import * as d3 from "d3";
import * as turf from "@turf/turf";

import "./Map.css";

import crashes from "../../Data/Crashes_2020.geo.json";
import schools from "../../Data/bbls_with_schools.geo.json";
import schoolsLabel from "../../Data/schools_studyarea.geo.json";
import schoolsAreas from "../../Data/bbls_with_schools.geo.json";

import square from "../../icons/square.png";
import hand from "../../icons/hand.png";
import handFilled from "../../icons/hand_filled_yellow.png";

import { getStackCrashes } from "./getStackCrashes";

const Map = () => {
  const { map, setMap, setCrashes } = useContext(MapContext);
  const mapContainer = useRef(null);

  const [lng, setLng] = useState(-73.925);
  const [lat, setLat] = useState(40.862);
  const [zoom, setZoom] = useState(16.25);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiY2xvdWRsdW4iLCJhIjoiY2s3ZWl4b3V1MDlkejNkb2JpZmtmbHp4ZiJ9.MbJU7PCa2LWBk9mENFkgxw";

    if (map) return;
    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/cloudlun/cll18o57a00t501qg18da32hr",
      center: [lng, lat],
      zoom: zoom,
      interactive: true,
      doubleClickZoom: false,
    });

    setMap(m);

    m.on("move", () => {
      setLng(m.getCenter().lng.toFixed(4));
      setLat(m.getCenter().lat.toFixed(4));
      setZoom(m.getZoom().toFixed(2));
    });

    m.on("load", async () => {
      const crash_features = crashes.features.filter(
        (d) =>
          d.properties.hour > 7 &&
          d.properties.hour < 16 &&
          d.properties.hour !== 11 &&
          d.properties.hour !== 12 &&
          d.geometry.coordinates[0] !== undefined &&
          d.geometry.coordinates[1] > 40.8491885183316
      );
      setCrashes(crash_features);

      const stackedCrashes = getStackCrashes(crash_features);

      const schoolArea_features = schoolsAreas.features.filter(
        (d) =>
          // d.geometry.coordinates[0][0][0][0] < -73.917 &&
          d.geometry.coordinates[0][0][0][1] > 40.8491885183316 &&
          d.geometry.coordinates[0][0][0][1] < 40.875161
      );

      console.log(schoolArea_features);

      m.addSource("school_areas", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: schoolArea_features,
        },
      });

      m.addSource("guards", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      m.addSource("crashes", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: stackedCrashes,
        },
      });

      m.addSource("buffer", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      m.loadImage(square, (error, image) => {
        if (error) throw error;
        m.addImage("icon_square", image, {
          sdf: "true",
        });
      });

      m.loadImage(hand, (error, image) => {
        if (error) throw error;
        m.addImage("icon_hand", image, {
          sdf: "true",
        });
      });

      m.loadImage(handFilled, (error, image) => {
        if (error) throw error;
        m.addImage("icon_hand_filled", image);
      });

      m.addLayer({
        id: "school_areas",
        type: "fill",
        source: "school_areas",
        layout: {},
        paint: {
          "fill-color": "#7cc592", // blue color fill
          "fill-opacity": 0.25,
        },
      });

      m.addLayer({
        id: "guards_vacant",
        type: "symbol",
        source: "guards",
        layout: {
          "icon-image": "icon_hand",
          "icon-size": 0.07,
          "icon-allow-overlap": true,
        },
        paint: {
          "icon-color": "#fdeca6",
          "icon-opacity": 0,
        },
      });

      m.addLayer({
        id: "guards",
        type: "symbol",
        source: "guards",
        layout: {
          "icon-image": "icon_hand_filled",
          "icon-size": 0.14,
          "icon-allow-overlap": false,
        },
        paint: {
          "icon-opacity": 0,
        },
      });

      m.addLayer({
        id: "crashes_all",
        type: "circle",
        source: "crashes",
        paint: {
          "circle-radius": 6.5,
          "circle-stroke-width": 0,
          "circle-color": [
            "case",
            ["all", [">=", ["get", "hour"], 7], ["<=", ["get", "hour"], 10]],
            "#ffd4d2",
            ["all", [">=", ["get", "hour"], 13], ["<=", ["get", "hour"], 16]],
            "#ff727c",
            "#e5e5e5",
          ],
          // "circle-stroke-color": "yellow",
          "circle-opacity": [
            "case",
            ["all", [">=", ["get", "hour"], 7], ["<=", ["get", "hour"], 10]],
            0.8,
            ["all", [">=", ["get", "hour"], 13], ["<=", ["get", "hour"], 16]],
            0.8,
            0.15,
          ],
        },
      });

      // m.addLayer({
      //   id: "school_area",
      //   type: "fill",
      //   source: "schools",
      //   layout: {},
      //   paint: {
      //     "fill-color": "transparent",
      //     "fill-opacity": 0,
      //     "fill-outline-color": "#e5f2e5",
      //   },
      // });

      m.addLayer({
        id: "outline",
        type: "line",
        source: "buffer",
        layout: {
          "line-cap": "round",
        },
        paint: {
          "line-color": "#fdeca6",
          "line-width": 3,
          "line-dasharray": [0, 2],
        },
      });

      m.on("click", "guards", (e) => {
        const guards = e.features[0];
        const crashes = getCrashesWithin500ft(guards.geometry, crash_features);
        const hours = [];

        crashes.forEach((c) => hours.push(c.properties.hour));

        let data = [
          { time: "morning", count: 0 },
          { time: "afternoon", count: 0 },
        ];

        hours.forEach((h) => {
          h >= 7 && h <= 10 ? data[0].count++ : data[1].count++;
        });

        // let data = hours.reduce((value, value2) => {
        //   return value[value2] ? ++value[value2] : (value[value2] = 1), value;
        // }, {});

        const popup = new mapboxgl.Popup({
          offset: [0, -110],
          closeButton: false,
          closeOnClick: true,
        });

        let clickedCoordinates = e.features[0].geometry.coordinates;
        let content = `<div class=content style="margin:10px 0 10px 5px; font-size:13px; text-align: start"> <span style="font-size:24px;font-weight:bold">${hours.length}</span> <br/> crashes near the guard positioned at the ${e.features[0].properties["STREET NAME 1"]} and ${e.features[0].properties["STREET NAME 2"]} intersection </div>
            <div class=barChart></div>`;

        popup.setLngLat(clickedCoordinates).setHTML(content).addTo(m);

        let bufferPoint = clickedCoordinates;
        const buffered = turf.buffer(turf.point(bufferPoint), 80, {
          units: "meters",
        });
        m.getSource("buffer").setData({
          type: "FeatureCollection",
          features: [buffered],
        });

        const width = 200;
        const height = 150;

        let svg = d3
          .select(".barChart")
          .append("svg")
          .attr("width", width + 15)
          .attr("height", height + 15);

        const x = d3
          .scaleBand()
          .range([0, width])
          .domain(data.map((d) => d.time))
          .padding(0.1);

        svg
          .append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x).tickSize(0).tickPadding(5))
          .select(".domain")
          .remove();

        const y = d3.scaleLinear().domain([0, 12]).range([height, 0]);

        svg
          .selectAll("bars")
          .data(data)
          .enter()
          .append("rect")
          .attr("x", (d) => x(d.time))
          .attr("y", (d) => y(d.count))
          .attr("width", x.bandwidth())
          .attr("height", (d) => height - y(d.count))
          .attr("fill", (d) =>
            d.time === "morning"
              ? "#ffd4d2"
              : d.time === "afternoon"
              ? "#ff727c"
              : "#e5e5e5"
          );

        svg
          .selectAll("nums")
          .data(data)
          .enter()
          .append("text")
          .attr("x", (d) => x(d.time) + x.bandwidth() / 2 - 6)
          .attr("y", (d) => y(d.count) - 4)
          .text((d) => d.count)
          .style("fill", "white");

        // m.removeLayer("schools")
        // m.removeSource("guards")
        // m.removeSource("crashes")
      });

      function getCrashesWithin500ft(crossingFeature, crashesFC) {
        const buffered = turf.buffer(
          turf.point(crossingFeature.coordinates),
          80,
          {
            units: "meters",
          }
        );
        return crashesFC.filter((feature) => {
          return turf.booleanIntersects(buffered, feature);
        });
      }
    });
  }, []);

  return <div className="fixed w-[100vw] h-[100vh] " ref={mapContainer}></div>;
};

export default Map;
