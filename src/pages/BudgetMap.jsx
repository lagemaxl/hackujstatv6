import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Map from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import { ColumnLayer } from "@deck.gl/layers";
import { AmbientLight, PointLight, LightingEffect } from "@deck.gl/core";
import "maplibre-gl/dist/maplibre-gl.css";
import { Loader } from "@mantine/core";
import {HeatmapLayer} from '@deck.gl/aggregation-layers';

const DATA_URL = "https://hackujapi.ladislavpokorny.cz/school/finance/1012";

const ambientLight = new AmbientLight({ color: [255, 255, 255], intensity: 1.0 });
const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [16.6, 49.2, 80000],
});
const lightingEffect = new LightingEffect({ ambientLight, pointLight1 });

const INITIAL_VIEW_STATE = {
  longitude: 16.6,
  latitude: 49.2,
  zoom: 7,
  pitch: 40,
  bearing: -20,
};

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";

function BudgetMap() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(DATA_URL)
      .then((response) => response.json())
      .then((apiData) => {
        const points = apiData.map((d) => ({
          position: [d.lontitude, d.lantitude],
          height: d.aktiva/100,
        }));
        setData(points);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
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
    new HeatmapLayer({
      id: "column-layer",
      data,
      diskResolution: 12,
      radius: 1,
      threshold: 0.03,
      intensity: 5,
      extruded: true,
      pickable: true,
      getPosition: (d) => d.position,
      getFillColor: [30, 144, 255],
      getElevation: (d) => d.height,
    }),

    new ColumnLayer({
      id: "column-layer",
      data,
      diskResolution: 10,
      radius: 300,
      coverage: 5,
      upperPercentile: 100,
      extruded: true,
      pickable: true,
      getPosition: (d) => d.position,
      getFillColor: [255, 140, 0],
      getElevation: (d) => d.height / 100,
    }),


  ];

  return (
    <DeckGL layers={layers} effects={[lightingEffect]} initialViewState={INITIAL_VIEW_STATE} controller={true}>
      <Map mapStyle={MAP_STYLE} />
    </DeckGL>
  );
}

export default BudgetMap;