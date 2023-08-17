import { useState, createContext } from "react";

import Map from "./Component/Map/Map";
// import Legend from "./Component/Map/Legend";
import Story from "./Component/StoryLine/Story";
import HourSelect from "./Component/Map/TimeSelect";


export const MapContext = createContext("");

function App() {
  const [map, setMap] = useState(null);
  const [crashes, setCrashes] = useState([]);

  return (
    <div className="relative w-[100vw] h-[100vh] overflow-scroll">
      <MapContext.Provider value={{ map, setMap, crashes, setCrashes }}>
        <Map />
        {/* <Legend /> */}
        <HourSelect/>
        <Story />
      </MapContext.Provider>
    </div>
  );
}

export default App;
