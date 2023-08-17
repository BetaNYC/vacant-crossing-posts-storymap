import React from "react";

const Introduction = () => {
  return (
    <div className="relative flex flex-col justify-between my-[calc(50vh-200px)] p-[25px] max-w-[400px]  bg-[rgba(0,0,0,0.5)]">
      <div>
        <div className="font-bold text-[20px]">
          NYPD is struggling to fill the shortage of crossing guards, leaving students who commute to school at risk.
        </div>
        <p className="my-2">
          Without enough crossing guards at key intersections near schools, students and other pedestrians are less protected during
          (morning) drop off and (afternoon) pick up.{" "}
        </p>
      </div>
      <div className="flex flex-row justify-center mt-10">
        <div className="flex flex-col items-center m-auto">
          <div className="w-[10px] h-[10px] bg-[rgba(0,0,0,0)] border-l-[1.5px] border-b-[1.5px] rotate-[-45deg]"></div>
          <div className="w-[10px] h-[10px] bg-[rgba(0,0,0,0)] border-l-[1.5px] border-b-[1.5px] rotate-[-45deg]"></div>
        </div>
        <p class="ml-2 text-sm align-top"><span className="font-bold">Scroll down</span> to check the related data and how crossing guards can protect.</p>
      </div>
    </div>
  );
};

export default Introduction;
