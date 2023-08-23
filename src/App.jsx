import { useState, createContext, useEffect } from "react";
import * as d3 from "d3";

import Map from "./Component/Map/Map";
// import Legend from "./Component/Map/Legend";
import Story from "./Component/StoryLine/Story";
import HourSelect from "./Component/Map/TimeSelect";


export const MapContext = createContext("");

function App() {
  const [map, setMap] = useState(null);
  const [crashes, setCrashes] = useState([]);
  const [posts, setPosts] = useState([])


  useEffect(() => {
    //load crash and crossing posts data; convert them to geojson features 
    const crashesPromise = d3.csv('./crashes_2020_08_2023.csv', d3.autoType)
    const postsPromise = d3.csv('./crossing_posts.csv', d3.autoType)

    Promise.all([crashesPromise, postsPromise]).then(datasets => {
      const [crashes, posts] = datasets.map(dataset => dataset.map(f => {
        return ({
          "type": "Feature",
          "properties": { ...f },
          "geometry": {
            "coordinates": [
              +f['LONGITUDE'],
              +f['LATITUDE']
            ],
            "type": "Point"
          }
        })
      }))
      setCrashes(crashes)
      setPosts(posts)
    })

  }, [])

  return (
    <div className="relative w-[100vw] h-[100vh] overflow-scroll">
      <MapContext.Provider value={{ map, setMap, crashes, posts }}>
        <Map />
        {/* <Legend /> */}
        <HourSelect />
        <Story />
      </MapContext.Provider>
    </div>
  );
}

export default App;
