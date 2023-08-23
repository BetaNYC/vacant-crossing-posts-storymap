import React, { useRef, useEffect, useContext } from "react";
import { MapContext } from "../../App";
import * as d3 from "d3";

const Background = () => {
  const { crashes } = useContext(MapContext);
  const ref = useRef(null);

  useEffect(() => {
    if(crashes){
      const height = ref.current.clientHeight;
      const width = ref.current.clientWidth;
  
      const features = crashes.filter(
        (d) =>
          d.geometry.coordinates[0] !== undefined &&
          d.geometry.coordinates[1] > 40.8491885183316
      );
  
      // creates an array of objects that has the count of crashes during that hour
      const hourData = [...Array(24).keys()].map((hour) => {
        return {
          hour,
          value: features.filter((d) => d.properties.hour === hour).length,
        };
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
  
      const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
  
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
    }
  }, [crashes]);

  return (
    <div className="my-[calc(100vh)] p-[25px] bg-[rgba(0,0,0,0.8)]">
      <div className="font-bold text-[20px]">
        1. High Frequency of Crashes During School Hours
      </div>
      <div className="mt-[15px] text-[16px]">
        <p>
          Students are facing significant risks during their commutes.&nbsp;
          <span className="font-bold text-[18px]">
            {(((197 + 316) / 1442) * 100).toFixed(0)}%
          </span>{" "}
          crashes occur during school drop off and pick times.{" "}
        </p>
        {/* <p>add pictures</p> */}
      </div>
      <div className="mt-[10px] text-[16px]">
        <p>
          Morning Shift (7-10):{" "}
          <span className="font-bold text-[18px] text-[#ffd4d2]"> 197</span>
        </p>
        <p>
          Afternoon Shift (13-16):{" "}
          <span className="font-bold text-[18px] text-[#ff727c]"> 316</span>
        </p>
      </div>
      <svg className="m-auto w-[350px] h-[300px]" ref={ref}></svg>
    </div>
  );
};

export default Background;
