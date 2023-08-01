const coordinates = [];
// 40.84918851833160,-73.93112997900160
d3.json("./data/crashes.geojson").then((data) => {
  // console.log(data.features);
  data.features = data.features.filter(
    (d) => d.geometry.coordinates[0] !== undefined
  );
  data.features = data.features.filter(
    (d) => d.geometry.coordinates[1] > 40.8491885183316
  );

  data.features.forEach((d) => {
    coordinates.push(d.geometry.coordinates);
  });

  // const unqie = [[coordinates[0][0],coordinates[0][1]]]

  // uniq = function (items, key) {
  //   var set = {};
  //   return items.filter(function (item) {
  //     var k = key ? key.apply(item) : item;
  //     return k in set ? false : (set[k] = true);
  //   });
  // };

  // unique = uniq(coordinates, [].join)

  // console.log(unique);

  function keyFor(item) {
    return item.geometry.coordinates[0] + ":" + item.geometry.coordinates[1];
  }
  let indexed = {};
  data.features.forEach(function (item) {
    indexed[keyFor(item)] = item;
  });
  let uniqueCoordinatesData = Object.keys(indexed).map(function (k) {
    return indexed[k];
  });
  console.log(uniqueCoordinatesData);

  mapboxgl.accessToken =
    "pk.eyJ1IjoiY2xvdWRsdW4iLCJhIjoiY2s3ZWl4b3V1MDlkejNkb2JpZmtmbHp4ZiJ9.MbJU7PCa2LWBk9mENFkgxw";

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/cloudlun/cl2eq8ceb000a15o06rah6zx5",
    center: [-73.925, 40.862],
    zoom: 17,
    interactive: true,
  });

  const dot = []

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
      data: data
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
