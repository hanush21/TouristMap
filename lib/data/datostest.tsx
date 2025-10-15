export interface DatosPoblacionItem {
  geojson: {
    type: "FeatureCollection";
    features: {
      type: "Feature";
      properties: { id: string; name: string };
      geometry: {
        type: "Polygon";
        coordinates: number[][][];
      };
    }[];
  };
  [key: string]: number | DatosPoblacionItem["geojson"]; 
}
export const datosPoblacionPorDia: DatosPoblacionItem[] = [
  {
    geojson: {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": { "id": "barri1", "name": "El Raval" },
          "geometry": {
            "type": "Polygon",
            "coordinates": [[[2.167, 41.375], [2.169, 41.375], [2.169, 41.377], [2.167, 41.377], [2.167, 41.375]]]
          }
        },
        {
          "type": "Feature",
          "properties": { "id": "barri2", "name": "Gòtic" },
          "geometry": {
            "type": "Polygon",
            "coordinates": [[[2.173, 41.377], [2.175, 41.377], [2.175, 41.379], [2.173, 41.379], [2.173, 41.377]]]
          }
        }
      ]
    },
    barri1: 30,
    barri2: 70
  },
  {
    geojson: {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": { "id": "barri1", "name": "El Raval" },
          "geometry": {
            "type": "Polygon",
            "coordinates": [[[2.167, 41.375], [2.169, 41.375], [2.169, 41.377], [2.167, 41.377], [2.167, 41.375]]]
          }
        },
        {
          "type": "Feature",
          "properties": { "id": "barri2", "name": "Gòtic" },
          "geometry": {
            "type": "Polygon",
            "coordinates": [[[2.173, 41.377], [2.175, 41.377], [2.175, 41.379], [2.173, 41.379], [2.173, 41.377]]]
          }
        }
      ]
    },
    barri1: 60,
    barri2: 40
  },
  {
    geojson: {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": { "id": "barri1", "name": "El Raval" },
          "geometry": {
            "type": "Polygon",
            "coordinates": [[[2.167, 41.375], [2.169, 41.375], [2.169, 41.377], [2.167, 41.377], [2.167, 41.375]]]
          }
        },
        {
          "type": "Feature",
          "properties": { "id": "barri2", "name": "Gòtic" },
          "geometry": {
            "type": "Polygon",
            "coordinates": [[[2.173, 41.377], [2.175, 41.377], [2.175, 41.379], [2.173, 41.379], [2.173, 41.377]]]
          }
        }
      ]
    },
    barri1: 90,
    barri2: 20
  }
];
