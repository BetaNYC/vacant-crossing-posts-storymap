import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const Problems = () => {
  const ref = useRef(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const height = ref.current.clientHeight;
    const width = ref.current.clientWidth;
    const data = {
      vacant: 19,
      guards: 8,
    };
    const color = d3.scaleOrdinal().range(["#e5e5e5", "#fdeca6"]);

    const radius = Math.min(width, height) / 2;

    const pie = d3.pie().value((d) => d[1]);
    const pieData = pie(Object.entries(data));

    svg
      .selectAll("vacant")
      .data(pieData)
      .join("path")
      .attr(
        "d",
        d3
          .arc()
          .innerRadius(0)
          .outerRadius(radius - 20)
      )
      .attr("fill", (d) => color(d.data[1]))
      .attr("stroke", "black")
      .style("stroke-width", "0px")
      .style("opacity", (d) => (d.data[1] === 19 ? 0.05 : 0.25))
      .attr("transform", `translate(${width / 2},${height / 2})`);
  });

  return (
    <div className="my-[calc(100vh)] p-[25px] max-w-[400px] bg-[rgba(0,0,0,0.5)]">
      <div className="font-bold text-[20px]">2. Crossing Guards Shortage</div>
      <div className="mt-[10px] text-[16px]">
        Knowing that crossing guards are crucial to keep passengers safe.
        However, 18 intersections near school should have guards are vacant.{" "}
        <span className="font-bold text-[#fdeca6]">Filled guards</span> only
        account for{" "}
        <span className="font-bold text-[16px] text-[#fdeca6]">
          {((8 / 27) * 100).toFixed(0)}%{" "}
        </span>
        of Total Positions. This makes students exposure on the road danger
        without any protection.
      </div>
      <svg className="mt-[20px] w-[300px] h-[300px]" ref={ref}></svg>
    </div>
  );
};

export default Problems;
