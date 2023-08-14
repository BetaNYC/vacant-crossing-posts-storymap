import React from "react";

const Introduction = () => {
  return (
    <div className="relative flex flex-col justify-between my-[calc(50vh-200px)] p-[25px] max-w-[400px]  bg-[rgba(0,0,0,0.5)]">
      <div className="mb-[60px]">
        <div className="font-bold text-[20px]">
          Shortage of students Commuter Protection: Vacant Crossing Guards at
          Intersections Near School
        </div>
        <p className="mt-[10px]">
          Without enough crossing guards around the school area at student
          activity time may put studnets safety at risk.{" "}
          <span className="font-bold">Scroll down</span> to check the related
          data and how crossing guards can protect.
        </p>
      </div>
      <div className="flex flex-col items-center m-auto">
        <div>scroll down</div>
        <div className="w-[10px] h-[10px] bg-[rgba(0,0,0,0)] border-l-[1.5px] border-b-[1.5px] rotate-[-45deg]"></div>
        <div className="w-[10px] h-[10px] bg-[rgba(0,0,0,0)] border-l-[1.5px] border-b-[1.5px] rotate-[-45deg]"></div>
      </div>
    </div>
  );
};

export default Introduction;
