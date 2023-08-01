const coordinates = [];
// 40.84918851833160,-73.93112997900160

function getCrashesWithin500ft(crossingFeature, crashesFC) {
  const buffered = turf.buffer(turf.point(crossingFeature.coordinates),
   80, {
    units: "meters",
  });
  return crashesFC.filter((feature) => {
    return turf.booleanIntersects(buffered, feature);
  });
}

d3.json("./data/crashes.geojson").then((data) => {
  const features = data.features.filter(
    (d) =>
      d.geometry.coordinates[0] !== undefined &&
      d.geometry.coordinates[1] > 40.8491885183316
  );

  //deep copy
  const featureCopy = JSON.parse(JSON.stringify(features));

  const uniqueCoordinates = featureCopy.reduce((uniqueCoordinates, feature) => {
    const key = feature.geometry.coordinates.map((i) => i.toFixed(4)).join(",");
    if (!(key in uniqueCoordinates)) {
      uniqueCoordinates[key] = [];
    }
    uniqueCoordinates[key].push(feature);

    return uniqueCoordinates;
  }, {});

  const stackedCrashes = Object.keys(uniqueCoordinates).reduce(
    (collection, key) => {
      const features = uniqueCoordinates[key].map((feature, i) => {
        feature.geometry.coordinates = key.split(",").map((i) => Number(i));

        //stack points
        feature.geometry.coordinates[1] += i * 0.00002;
        return feature;
      });

      return [...collection, ...features];
    },
    []
  );

  console.log(stackedCrashes);

  mapboxgl.accessToken =
    "pk.eyJ1IjoiY2xvdWRsdW4iLCJhIjoiY2s3ZWl4b3V1MDlkejNkb2JpZmtmbHp4ZiJ9.MbJU7PCa2LWBk9mENFkgxw";

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/cloudlun/cl2eq8ceb000a15o06rah6zx5",
    center: [-73.925, 40.862],
    zoom: 17,
    interactive: true,
  });

  const dot = [];

  // for (let i = 0; i < data.features.length; i++) {
  //   let count = 0;
  //   for (let j = 0; j < uniqueCoordinatesData.length; j++) {
  //     if (
  //       data.features[i].geometry.coordinates[0] ===
  //       uniqueCoordinatesData[j].geometry.coordinates[0]
  //       &&
  //       data.features[i].geometry.coordinates[1] ===
  //       uniqueCoordinatesData[j].geometry.coordinates[1]
  //     ) {
  //       dot.push(1)
  //       const el = document.createElement("div");
  //       el.className = "marker";
  //       count = count;
  //       new mapboxgl.Marker(el)
  //         .setLngLat([
  //           uniqueCoordinatesData[j].geometry.coordinates[0],
  //           uniqueCoordinatesData[j].geometry.coordinates[1]+ count*0.000015,
  //         ])
  //         .addTo(map);
  //     }
  //   }
  // }

  console.log(data.features.length);
  console.log(dot.length);

  map.on("load", () => {
    map.addSource("schools", {
      type: "geojson",
      data: "./data/school_info.geojson",
    });

    map.addSource("guards", {
      type: "geojson",
      data: "./data/2023 SCG TEMPLATE2+NEW+ 07-10-2023.geojson",
    });

    map.addSource("crashes", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: stackedCrashes,
      },
    });

    map.loadImage("./icons/cross.png", (error, image) => {
      if (error) throw error;
      map.addImage("icon_cross", image, {
        sdf: "true",
      });
    });

    map.loadImage("./icons/square.png", (error, image) => {
      if (error) throw error;
      map.addImage("icon_square", image, {
        sdf: "true",
      });
    });

    map.addLayer({
      id: "guards",
      type: "symbol",
      source: "guards",
      layout: {
        "icon-image": "icon_square",
        "icon-size": 1.2,
        "icon-allow-overlap": true,
      },
      paint: {
        "icon-color": "green",
        "icon-opacity": ["match", ["get", "LAST NAME"], "VACANT", 0, 0],
        // "icon-halo-color": "#fff",
        // "icon-halo-width": 2
      },
    });

    map.addLayer({
      id: "vacant_guards",
      type: "symbol",
      source: "guards",
      layout: {
        "icon-image": "icon_cross",
        "icon-size": 1.1,
        "icon-allow-overlap": false,
      },
      paint: {
        "icon-color": "red",
        "icon-opacity": ["match", ["get", "LAST NAME"], "VACANT", 0.8, 0],
        // "icon-halo-color": "#fff",
        // "icon-halo-width": 2
      },
    });

    map.on("click", "vacant_guards", (e) => {
      const guards = e.features[0];
      const crashes = getCrashesWithin500ft(guards.geometry, features);

      console.log(crashes);
    });

    map.addLayer({
      id: "crashes",
      type: "circle",
      source: "crashes",
      paint: {
        "circle-radius": 5,
        "circle-stroke-width": 0,
        "circle-color": [
          "case",
          ["all", [">=", ["get", "hour"], 13], ["<=", ["get", "hour"], 16]],
          "#f48e3b",
          ["all", [">=", ["get", "hour"], 7], ["<=", ["get", "hour"], 10]],
          "#f9c69d",
          "#7a471d",
        ],
        // "circle-stroke-color": "yellow",
        "circle-opacity": [
          "case",
          ["all", [">=", ["get", "hour"], 13], ["<=", ["get", "hour"], 16]],
          1,
          ["all", [">=", ["get", "hour"], 7], ["<=", ["get", "hour"], 10]],
          1,
          0,
        ],
      },
    });

    map.addLayer({
      id: "schools",
      type: "symbol",
      source: "schools",
      layout: {
        "icon-image": "icon_square",
        "icon-size": 0.9,
        "icon-allow-overlap": false,
      },
      paint: {
        "icon-color": "green",
        "icon-opacity": 0.6,
      },
      // paint: {
      //   "circle-radius": 5,
      //   "circle-stroke-width": 0,
      //   "circle-color": "green",
      //   "circle-stroke-color": "#00766d",
      // },
    });
  });
});
