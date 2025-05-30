import { GeoJSONFeature } from "mapbox-gl";

export const getUniqueFeatures = (
    features: GeoJSONFeature[],
    comparatorProperty: string
) => {
    const uniqueIds = new Set();
    const uniqueFeatures = [];
    for (const feature of features) {
        if (feature.properties === null) {
            continue;
        }
        const id = feature.properties[comparatorProperty];
        if (!uniqueIds.has(id)) {
            uniqueIds.add(id);
            uniqueFeatures.push(feature);
        }
    }
    return uniqueFeatures;
};