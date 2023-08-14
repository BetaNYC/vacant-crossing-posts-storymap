import React from "react";

import triangle from "../../icons/triangle.svg";
import triangleVacant from "../../icons/triangle_vacant.svg" 

const Legend = () => {
  return (
    <div className="fixed right-[10px] bottom-[40px] flex flex-col gap-[6px] px-[18px] py-[24px] w-[250px]  bg-[rgba(0,0,0,0.3)] text-white z-2">
      <div className="flex items-center gap-[5px]">
        <div className="">
          <img src={triangle} alt="" />
        </div>
        <div>Guards</div>
      </div>
      <div className="flex items-center gap-[5px]">
        <div>
          <img src={triangleVacant} alt="" />
        </div>
        <div>Vacant Guards</div>
      </div>
      <div className="flex items-center gap-[9px]">
        <div className="ml-[4px] w-[12px] h-[12px] bg-[#d1c09f] rounded-full"></div>
        <div>Crahses (Morning)</div>
      </div>
      <div className="flex items-center gap-[9px]">
      <div className="ml-[4px] w-[12px] h-[12px] bg-[#CA936D] rounded-full"></div>
        <div>Crahses (Afternoon)</div>
      </div>
      <div className="flex items-center gap-[9px]">
      <div className="ml-[4px] w-[12px] h-[12px] bg-[#e5e5e5] rounded-full"></div>
        <div>Crahses (Other)</div>
      </div>
      <div className="flex items-center gap-[9px]">
      <div className="ml-[4px] w-[12px] h-[12px] bg-[#54C15A]"></div>
        <div>School</div>
      </div>
    </div>
  );
};

export default Legend;
