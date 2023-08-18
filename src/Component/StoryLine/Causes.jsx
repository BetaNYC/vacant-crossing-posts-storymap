import React from "react";
import * as d3 from "d3";

const Causes = () => {
  return (
    <div className="my-[calc(100vh)] p-[25px] max-w-[400px] bg-[rgba(0,0,0,0.8)]">
      <div className="font-bold text-[20px]">
        4. The Crashes That Vacant Crossing Guards Might Solve 
      </div>
      <div className="mt-[15px] text-[16px]">
        <p>
          From 2020 onwards, a concerning total of 51 crashes have occurred in
          the&nbsp;
          <span className="font-bold text-[#ffd4d2]">morning</span> and{" "}
          <span className="font-bold text-[#ff727c]">afternoon</span> at
          locations where positions for crossing guards.
        </p>
        <p className="mt-[10px]">
          Filling these vacant positions could potentially reduce the likelihood
          of crashes and enhance student safety during their commutes.
        </p>
      </div>
      <div className="flex items-center mt-[20px] w-[350px] h-[300px]">
        <div className="flex items-center">
          <div
            className={`pt-[150px] w-[125px] h-[300px] text-[#191919] text-center bg-[rgb(255,212,210,.95)]`}
          >
            19
          </div>
          <div
            className={`pt-[150px] w-[225px] h-[300px] text-[#191919] text-center bg-[rgb(255,114,124,.95)]`}
          >
            32
          </div>
        </div>
      </div>
    </div>
  );
};

export default Causes;
