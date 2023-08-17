import React, { useState, useRef, useEffect, useContext } from "react";
import { MapContext } from "../../App";

import mapboxgl from "mapbox-gl";
import * as d3 from "d3";
import * as turf from "@turf/turf";

import "./Map.css";

import crashes from "../../Data/Crashes_2020.geo.json";

import handEmpty from "../../icons/hand_empty.png";
import handFilled from "../../icons/hand_filled.png";

import { getStackCrashes } from "./getStackCrashes";

function getCrashesWithinMeters(crossingFeature, crashesFC, meter = 80) {
  const buffered = turf.buffer(turf.point(crossingFeature.coordinates), meter, {
    units: "meters",
  });
  return crashesFC.filter((feature) => {
    return turf.booleanIntersects(buffered, feature);
  });
}

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

      m.loadImage(handEmpty, (error, image) => {
        if (error) throw error;
        m.addImage("icon_hand", image, {
          sdf: true,
        });
      });

      m.loadImage(handFilled, (error, image) => {
        if (error) throw error;
        m.addImage("icon_hand_filled", image);
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
        const { geometry, properties } = e.features[0];
        let { coordinates } = geometry;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        const crashes = getCrashesWithinMeters(geometry, crash_features, 80);

        // get count of crashes for morning and afternoon
        // TODO - Refactor to a reduce function
        // const hours = [];

        // crashes.forEach((c) => hours.push(c.properties.hour));

        // let data = [
        //   { time: "morning", count: 0 },
        //   { time: "afternoon", count: 0 },
        // ];

        // hours.forEach((h) => {
        //   h >= 7 && h <= 10 ? data[0].count++ : data[1].count++;
        // });

        const data = crashes.reduce((data, crash) => {
          if (data.length === 0) {
            data = [
              { time: "morning", count: 0 },
              { time: "afternoon", count: 0 },
            ];
          }
          crash.properties.hour >= 7 && crash.properties.hour <= 10
            ? data[0].count++
            : data[1].count++;

          return data;
        }, []);

        let clickedCoordinates = coordinates.slice();
        console.log(properties);
        let content = `<div class="content">
                          <h4>Post ${properties["POST #"]} is ${
          properties["LAST NAME"] === "VACANT"
            ? '<span class="vacant">Vacant</span>'
            : "Staffed"
        }</h4>
                          <span style="font-size:24px;font-weight:bold">${
                            crashes.length === 0 ? 0 : data[0].count + data[1].count
                          }</span> 
                          <br/> crashes occurred near this post on the ${
                            properties["STREET NAME 1"]
                          } and ${properties["STREET NAME 2"]} intersection
                        </div>
                        <div class="barChart"></div>`;

        const popup = new mapboxgl.Popup({
          offset: [0, -30],
          anchor: "bottom-left",
          closeButton: false,
          closeOnClick: true,
        });

        popup.setLngLat(clickedCoordinates).setHTML(content).addTo(m);

        //add buffer around area
        const bufferedPoint = turf.buffer(turf.point(clickedCoordinates), 80, {
          units: "meters",
        });

        m.getSource("buffer").setData({
          type: "FeatureCollection",
          features: [bufferedPoint],
        });

        //create chart for popup
        const width = 200,
          height = 150,
          margin = 15;

        const svg = d3
          .select(".barChart")
          .append("svg")
          .attr("width", width + margin)
          .attr("height", height + margin);

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
      });
    });

    //deconstruction
    return () => {
      m.remove();
    };
  }, []);

  return <div className="fixed w-[100vw] h-[100vh]" ref={mapContainer}></div>;
};

export default Map;
