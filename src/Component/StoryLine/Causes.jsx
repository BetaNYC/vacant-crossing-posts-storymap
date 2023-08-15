import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const Causes = () => {
  //   const ref = useRef(null);

  //   useEffect(() => {
  //     const svg = d3.select(ref.current);
  //     const height = ref.current.clientHeight;
  //     const width = ref.current.clientWidth;

  //   });

  return (
    <div className="my-[calc(100vh)] p-[25px] max-w-[400px] bg-[rgba(0,0,0,0.5)]">
      <div className="font-bold text-[20px]">
        3. Click on crossing guards to view the crashes nearby
      </div>
      <div className="mt-[10px] text-[16px]">
        <span>Since 2020 There were</span>
        <span className="font-bold text-[18px]"> 51 </span>
        crashes during <span className="font-bold text-[#ffd4d2]">
          morning
        </span>{" "}
        and <span className="font-bold text-[#ff727c]">afternoon</span> at
        locations where there are current vacancies. Filled the vacant positions
        may decrease the possibility of crashes and protect students safety
        during commuting.
      </div>
      <div className="flex items-center mt-[20px] w-[350px] h-[300px]">
        <div className="flex items-center">
          <div
            className={`pt-[150px] w-[125px] h-[300px] text-[#191919] text-center bg-[rgb(255,212,210,.95)]`}
          >
            19
            {/* 16% */}
          </div>
          <div
            className={`pt-[150px] w-[225px] h-[300px] text-[#191919] text-center bg-[rgb(255,114,124,.95)]`}
          >
            32
            {/* 48% */}
          </div>
        </div>
        {/* <div
          className={`pt-[150px]  w-[128px] h-[300px] text-[#191919] text-center bg-[#e5e5e5]`}
        >
          30
        </div> */}
      </div>
    </div>
  );
};

export default Causes;
