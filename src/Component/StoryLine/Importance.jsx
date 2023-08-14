import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

import crashes from "../../Data/crashes.geojson";

const Importance = () => {
  const ref = useRef(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const height = ref.current.clientHeight;
    const width = ref.current.clientWidth;

    d3.json(crashes).then((data) => {
      const features = data.features.filter(
        (d) =>
          d.geometry.coordinates[0] !== undefined &&
          d.geometry.coordinates[1] > 40.8491885183316
      );
      const hours = [];
      features.forEach((c) => hours.push(c.properties.hour));

      //   const moring = hours.filter((h) => h >= 7 && h <= 10);
      //   const afternoon = hours.filter((h) => h >= 13 && h <= 16);

      let hourData = [];
      for (let i = 0; i < 24; i++) {
        hourData.push({
          hour: i,
          value: 0,
        });
      }

      hours.forEach((h, i) => {
        hourData.map((d, j) => {
          if (h === d.hour) {
            d.value++;
          }
        });
      });

      let svg = d3
        .select(ref.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      const x = d3
        .scaleBand()
        .range([0, width])
        .domain(hourData.map((d) => d.hour))
        .padding(0.3);

      svg
        .append("g")
        .attr("transform", "translate(0," + (height - 25) + ")")
        .call(d3.axisBottom(x).tickSize(0).tickPadding(5))
        .select(".domain")
        .remove();

      const y = d3.scaleLinear().domain([0, 50]).range([height, 0]);

      svg
        .selectAll("bars")
        .data(hourData)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.hour))
        .attr("y", (d) => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - 30 - y(d.value))
        .attr("fill", (d) =>
          d.hour >= 7 && d.hour <= 10
            ? "#ffd4d2"
            : d.hour >= 13 && d.hour <= 16
            ? "#ff727c"
            : "#e5e5e5"
        )
        .attr("opacity", (d) =>
          d.hour >= 7 && d.hour <= 10
            ? 1
            : d.hour >= 13 && d.hour <= 16
            ? 1
            : 0.05
        );

    });
  });

  return (
    <div className="my-[calc(100vh)] p-[25px] bg-[rgba(0,0,0,0.5)]">
      <div className="font-bold text-[20px]">
       1. Crossing Guards are Important
      </div>
      <div className="mt-[10px] text-[16px]">
        Crash Cases from 2022 <br /> Morning Gruading Hours (7-10):{" "}
        <span className="font-bold text-[18px] text-[#ffd4d2]"> 101</span>
        <br />
        Afternoon Gruading Hours (13-16):{" "}
        <span className="font-bold text-[18px] text-[#ff727c]"> 190</span>
        <br />
        Percentage of Total:
        <span className="font-bold text-[18px]">
          {" "}
          {((220 / 625) * 100).toFixed(0)}%
        </span>
      </div>
      <svg className="m-auto w-[350px] h-[300px]" ref={ref}></svg>
    </div>
  );
};

export default Importance;
