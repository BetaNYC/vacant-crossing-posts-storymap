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

    const radius = Math.min(width, height) / 2.5;

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
          .outerRadius(radius )
      )
      .attr("fill", (d) => color(d.data[1]))
      .attr("stroke", "black")
      .style("stroke-width", "0px")
      .style("opacity", (d) => (d.data[1] === 19 ? 0.1 : 0.4))
      .attr("transform", `translate(${width / 2},${height / 2})`);
  });

  return (
    <div className="my-[calc(100vh)] p-[25px] max-w-[400px] bg-[rgba(0,0,0,0.8)]">
      <div className="font-bold text-[20px]">3. Crossing Guards Shortage</div>
      <div className="mt-[15px] text-[16px]">
        <p>
          Crossing guards play a vital role in ensuring the safety of students
          near school zones. Unfortunately, there is a shortage of crossing
          guards at intersections adjacent to schools.
        </p>

        <p className="mt-[10px]">
          Currently, only&nbsp;
          <span className="font-bold text-[16px] text-[#fdeca6]">
            {((8 / 27) * 100).toFixed(0)}%{" "}
          </span>
          of the total available positions for guards have been successfully
          filled.
        </p>
      </div>
      {/* <div className="flex">
        <div className="flex items-center mt-[25px] gap-[12px]">
          <img src={handFilled} className="w-[20px] h-[20px]"></img>
          <div className="">Filled Guards</div>
        </div>
        <div className="flex items-center mt-[25px] gap-[12px]">
          <img src={handEmpty} className="w-[40px] h-[20px] color-[#fdeca6]" />
          <div >Empty Guards</div>
        </div>
      </div> */}

      <svg className="mt-[20px] w-[300px] h-[300px]" ref={ref}></svg>
      <p className="my-4 text-sm">
        🖰 Click on a hand icon for more details at that intersection.
      </p>
    </div>
  );
};

export default Problems;
