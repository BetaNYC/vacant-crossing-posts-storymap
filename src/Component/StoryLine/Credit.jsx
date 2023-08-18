import React from "react";

const Credit = () => {
  return (
    <div className="my-[calc(100vh)] p-[25px] bg-[rgba(0,0,0,0.8)]">
      <div className="flex font-bold text-[20px] ">Credits:</div>
      <div className="flex gap-[20px] mt-[20px] ">
        <div className="">
          <div className="font-bold mb-[10px] text-[18px] text-[#fdeca6]">
            BetaNYC Lab
          </div>
          <div className="">Zhi Keng He</div>
          <div className="">Hao Lun Hung</div>
        </div>
        <div className="block w-[2px] h-[80px] bg-[rgba(255,255,255,0.15)]"></div>
        <div>
          <div className="font-bold mb-[10px] text-[18px] text-[#fdeca6]">
            Data Source
          </div>
          <div>NYPD - School Crossing Guards Data</div>
          <div>NYC OpenData - Motor Vehicle Collisions - Crashes</div>
        </div>
      </div>
    </div>
  );
};

export default Credit;
