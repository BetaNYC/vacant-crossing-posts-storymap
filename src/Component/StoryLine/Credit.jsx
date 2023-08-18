import React from "react";

const Credit = () => {
  return (
    <div className="my-[calc(100vh)] p-[25px] bg-[rgba(0,0,0,0.8)]">
      <div className="flex font-bold text-[20px] ">Credits:</div>
      <div className="mt-[20px] ">
        <div className="flex items-start">
          <div className="font-bold mb-[10px] text-[18px] text-[#fdeca6]">
            BetaNYC Lab
          </div>
          <div className="ml-[20px] text-[16px]">
            <div className="mb-[5px]">Zhi Keng He</div>
            <div className="">Hao Lun Hung</div>
          </div>
        </div>
        <div className="my-[20px] w-[100%] h-[1px] bg-[rgba(255,255,255,0.12)]"></div>
        <div className="flex items-start">
          <div className="font-bold mr-[10px] mb-[10px] text-[18px] text-[#fdeca6]">
            Data Source
          </div>
          <div className="ml-[20px] text-[16px]">
            <div className="mb-[5px]">NYPD - School Crossing Guards Data</div>
            <div>NYC OpenData - Motor Vehicle Collisions - Crashes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credit;
