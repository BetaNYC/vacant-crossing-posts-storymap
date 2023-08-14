d3.csv(
  "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv"
).then((d) => console.log(d));

d3.json("./data/crashes.geojson").then((data) => {
  const features = data.features.filter(
    (d) =>
      d.geometry.coordinates[0] !== undefined &&
      d.geometry.coordinates[1] > 40.8491885183316
  );

  //deep copy
  const featureCopy = JSON.parse(JSON.stringify(features));

  const uniqueCoordinates = featureCopy.reduce((uniqueCoordinates, feature) => {
    const key = feature.geometry.coordinates.map((i) => i.toFixed(5)).join(",");
    if (!(key in uniqueCoordinates)) {
      uniqueCoordinates[key] = [];
    }
    uniqueCoordinates[key].push(feature);

    return uniqueCoordinates;
  }, {});

  console.log(uniqueCoordinates)

  const stackedCrashes = Object.keys(uniqueCoordinates).reduce(
    (collection, key) => {
      const features = uniqueCoordinates[key].map((feature, i) => {
        feature.geometry.coordinates = key.split(",").map((i) => Number(i));
        feature.geometry.coordinates[1] += i * 0.00003;
        return feature;
      });

      return [...collection, ...features];
    },
    []
  );

  mapboxgl.accessToken =
    "pk.eyJ1IjoiY2xvdWRsdW4iLCJhIjoiY2s3ZWl4b3V1MDlkejNkb2JpZmtmbHp4ZiJ9.MbJU7PCa2LWBk9mENFkgxw";

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/cloudlun/cl2eq8ceb000a15o06rah6zx5",
    center: [-73.925, 40.862],
    zoom: 16.25,
    interactive: true,
  });

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
      id: "vacant_guards",
      type: "symbol",
      source: "guards",
      layout: {
        "icon-image": "icon_square",
        "icon-size": 1.5,
        "icon-rotate": 45,
        "icon-allow-overlap": false,
      },
      paint: {
        "icon-color": ["match", ["get", "LAST NAME"], "VACANT", "red", "green"],
        "icon-opacity": 0.6,

        // "icon-halo-color": "#fff",
        // "icon-halo-width": 2
      },
    });

    let clickedCoordinates;
    let tooltip = d3.select("body").append("div").attr("class", "tooltip");

    map.on("click", "vacant_guards", (e) => {
      const guards = e.features[0];
      const crashes = getCrashesWithin500ft(guards.geometry, features);
      const hours = [];
      
      crashes.forEach((c) => hours.push(c.properties.hour));

      let data = [
        { time: "morning", count: 0 },
        { time: "afternoon", count: 0 },
        { time: "other", count: 0 },
      ];

      hours.forEach((h) => {
        h >= 7 && h <= 10
          ? data[0].count++
          : h >= 13 && h >= 16
          ? data[1].count++
          : data[2].count++;
      });
      console.log(data);

      // let data = hours.reduce((value, value2) => {
      //   return value[value2] ? ++value[value2] : (value[value2] = 1), value;
      // }, {});

      const popup = new mapboxgl.Popup({
        className: "guards_popup",
        closeButton: false,
        closeOnClick: true,
      });

      clickedCoordinates = e.lngLat;
      let content = `<div class=content>${hours.length} traffic accidents <br/> within 500 meters</div>
      <div class=barChart></div>`;

      popup.setLngLat(clickedCoordinates).setHTML(content).addTo(map);

      const width = 200;
      const height = 150;

      let svg = d3
        .select(".barChart")
        .append("svg")
        .attr("width", width + 15)
        .attr("height", height + 15);

      const x = d3
        .scaleBand()
        .range([0, width])
        .domain(data.map((d) => d.time))
        .padding(0.1);

      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0).tickPadding(5))
        .select(".domain")
        .remove();

      const y = d3.scaleLinear().domain([0, 12]).range([height, 0]);

      svg
        .selectAll("bars")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.time))
        .attr("y", (d) => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.count))
        .attr("fill", (d) =>
          d.time === "morning"
            ? "#f9c69d"
            : d.time === "afternoon"
            ? "#f48e3b"
            : "#e5e5e5"
        );

      svg
        .selectAll("nums")
        .data(data)
        .enter()
        .append("text")
        .attr("x", (d) => x(d.time) + x.bandwidth() / 2 - 6)
        .attr("y", (d) => y(d.count) - 4)
        .text((d) => d.count);

      // tooltip
      //   .html(content)
      //   .style("position", "fixed")
      //   .style("visibility", "visible")
      //   .style("left", map.project(clickedCoordinates).x + "px")
      //   .style("top", map.project(clickedCoordinates).y + "px");
    });

    map.addLayer({
      id: "crashes",
      type: "circle",
      source: "crashes",
      paint: {
        "circle-radius": 6.5,
        "circle-stroke-width": 0,
        "circle-color": [
          "case",
          ["all", [">=", ["get", "hour"], 7], ["<=", ["get", "hour"], 10]],
          "#f9c69d",
          ["all", [">=", ["get", "hour"], 13], ["<=", ["get", "hour"], 16]],
          "#f48e3b",
          "#e5e5e5",
        ],
        // "circle-stroke-color": "yellow",
        "circle-opacity": [
          "case",
          ["all", [">=", ["get", "hour"], 7], ["<=", ["get", "hour"], 10]],
          0.8,
          ["all", [">=", ["get", "hour"], 13], ["<=", ["get", "hour"], 16]],
          0.8,
          0.2,
        ],
      },
    });

    function getCrashesWithin500ft(crossingFeature, crashesFC) {
      const buffered = turf.buffer(
        turf.point(crossingFeature.coordinates),
        80,
        {
          units: "meters",
        }
      );
      return crashesFC.filter((feature) => {
        return turf.booleanIntersects(buffered, feature);
      });
    }

    // map.addLayer({
    //   id: "schools",
    //   type: "symbol",
    //   source: "schools",
    //   layout: {
    //     "icon-image": "icon_square",
    //     "icon-size": 0.9,
    //     "icon-allow-overlap": false,
    //   },
    //   paint: {
    //     "icon-color": "green",
    //     "icon-opacity": 0.6,
    //   },
    // paint: {
    //   "circle-radius": 5,
    //   "circle-stroke-width": 0,
    //   "circle-color": "green",
    //   "circle-stroke-color": "#00766d",
    // },
    // });
  });
});
