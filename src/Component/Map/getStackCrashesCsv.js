import { feature } from "@turf/turf";

export function getStackCrashesCsv(crashes) {
  const crashes_copy = JSON.parse(JSON.stringify(crashes));
  const uniqueCoordinates = crashes_copy.reduce((uniqueCoordinates, crash) => {
    const key = `${crash.LONGITUDE.toFixed(5)}, ${crash.LATITUDE.toFixed(5)}`;

    if (!(key in uniqueCoordinates)) {
      uniqueCoordinates[key] = [];
    }

    uniqueCoordinates[key].push(crash);
    return uniqueCoordinates;
  }, {});

  return Object.keys(uniqueCoordinates).reduce((collection, key) => {
    const features = uniqueCoordinates[key].map((feature,i) => {
        feature
    })

  })
}
