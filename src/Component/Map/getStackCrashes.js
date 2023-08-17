export function getStackCrashes(crash_features) {
  const crash_features_copy = JSON.parse(JSON.stringify(crash_features));
  const uniqueCoordinates = crash_features_copy.reduce(
    (uniqueCoordinates, feature) => {
      const key = feature.geometry.coordinates
        .map((i) => i.toFixed(5))
        .join(",");
      if (!(key in uniqueCoordinates)) {
        uniqueCoordinates[key] = [];
      }
      uniqueCoordinates[key].push(feature);

      return uniqueCoordinates;
    },
    {}
  );

  return Object.keys(uniqueCoordinates).reduce((collection, key) => {
    const features = uniqueCoordinates[key].map((feature, i) => {
      feature.geometry.coordinates = key.split(",").map((i) => Number(i));
      feature.geometry.coordinates[1] += i * 0.00005;
      return feature;
    });

    return [...collection, ...features];
  }, []);
}
