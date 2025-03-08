import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Map from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import { ColumnLayer } from "@deck.gl/layers";
import { AmbientLight, PointLight, LightingEffect } from "@deck.gl/core";
import "maplibre-gl/dist/maplibre-gl.css";
import { Loader, Slider } from "@mantine/core";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
});
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

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";

function BudgetMap() {
  const [year, setYear] = useState(1012);
  const [sliderValue, setSliderValue] = useState(1012);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://hackujapi.ladislavpokorny.cz/school/finance/${year}`);
        const apiData = await response.json();
        const points = apiData.map((d) => ({
          position: [d.lontitude, d.lantitude],
          height: d.aktiva / 100,
        }));
        setData(points);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [year]);

  if (loading) {
    return (
      <div>
        <Loader position="center" />
      </div>
    );
  }

  const layers = [
    new HeatmapLayer({
      id: "heatmap-layer",
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
    <>
      <DeckGL
        layers={layers}
        effects={[lightingEffect]}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
      >
        <Map mapStyle={MAP_STYLE} />
      </DeckGL>
      <Slider
        style={{ width: "80%", position: "absolute", bottom: "5em" }}
        min={1012}
        max={2312}
        step={100}
        value={sliderValue}
        onChange={setSliderValue}
        onChangeEnd={setYear}
        marks={[
          { value: 1012, label: "2010" },
          { value: 1112, label: "2011" },
          { value: 1212, label: "2012" },
          { value: 1312, label: "2013" },
          { value: 1412, label: "2014" },
          { value: 1512, label: "2015" },
          { value: 1612, label: "2016" },
          { value: 1712, label: "2017" },
          { value: 1812, label: "2018" },
          { value: 1912, label: "2019" },
          { value: 2012, label: "2020" },
          { value: 2112, label: "2021" },
          { value: 2212, label: "2022" },
          { value: 2312, label: "2023" },
        ]}
      />
    </>
  );
}

export default BudgetMap;
