import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Map from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import { AmbientLight, PointLight, LightingEffect } from "@deck.gl/core";
import { load } from "@loaders.gl/core";
import { CSVLoader } from "@loaders.gl/csv";
import "maplibre-gl/dist/maplibre-gl.css";
import { Loader } from "@mantine/core";

const DATA_URL =
  "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv";

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
});
const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-122.4, 37.8, 80000],
});
const lightingEffect = new LightingEffect({ ambientLight, pointLight1 });

const INITIAL_VIEW_STATE = {
  longitude: -122.4,
  latitude: 37.8,
  zoom: 14,
  pitch: 40,
  bearing: -20,
};

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";

const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78],
];

function BudgetMap() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load(DATA_URL, CSVLoader).then((csvData) => {
      const points = csvData.data
        .map((d) => (Number.isFinite(d.lng) ? [d.lng, d.lat] : null))
        .filter(Boolean);
      setData(points);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div>
        <Loader position="center" />
      </div>
    );
  }

  const layers = [
    new HexagonLayer({
      id: "hexagon-layer",
      data,
      colorRange,
      coverage: 1,
      elevationRange: [0, 3000],
      elevationScale: data.length ? 50 : 0,
      extruded: true,
      getPosition: (d) => d,
      pickable: true,
      radius: 500,
      upperPercentile: 100,
      material: {
        ambient: 0.64,
        diffuse: 0.6,
        shininess: 32,
        specularColor: [51, 51, 51],
      },
    }),
  ];

  return (
    <DeckGL
      layers={layers}
      effects={[lightingEffect]}
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
    >
      <Map mapStyle={MAP_STYLE} />
    </DeckGL>
  );
}

export default BudgetMap;
