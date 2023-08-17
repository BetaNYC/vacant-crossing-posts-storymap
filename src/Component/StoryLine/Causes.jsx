import React from "react";
import * as d3 from "d3";

const Causes = () => {
  return (
    <div className="my-[calc(100vh)] p-[25px] max-w-[400px] bg-[rgba(0,0,0,0.8)]">
      <div className="font-bold text-[20px]">
        3. Click on crossing guards to view the crashes nearby
      </div>
      <div className="mt-[10px] text-[16px]">
        Since 2020, there have been a total of 51 crashes in the&nbsp;
        <span className="font-bold text-[#ffd4d2]">morning</span> and&nbsp;
        <span className="font-bold text-[#ff727c]">afternoon</span> at locations
        where there are currently vacant positions. Filling these vacant
        positions could potentially reduce the likelihood of crashes and enhance
        student safety during their commutes.
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
