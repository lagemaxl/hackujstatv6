import {
    MapContainer,
    TileLayer,
    GeoJSON,
    useMap,
  } from "react-leaflet";
  import { useState, useEffect } from "react";
  import "./style/Home.css";
  import L from "leaflet";
  
  const Home = () => {
    const [geojsonData, setGeojsonData] = useState(null);
    const [districtsGeojsonData, setDistrictsGeojsonData] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);
  
    useEffect(() => {
      fetch(`kraje.json`)
        .then((response) => response.json())
        .then((data) => {
          setGeojsonData(data);
        });
    }, []);
  
    const loadDistricts = (region) => {
      fetch(`okresy.json`)
        .then((response) => response.json())
        .then((data) => {
          const filteredDistricts = {
            type: "FeatureCollection",
            features: data.features.filter(
              (feature) => feature.properties.kraj_nazev === region.properties.nazev
            ),
          };
          setDistrictsGeojsonData(filteredDistricts);
        });
    };
  
    return (
      <div>
        <MapContainer
          center={[49.7437572, 15.3386383]}
          zoom={8}
          scrollWheelZoom={true}
          className="map"
        >
          {/* kraje */}
          {geojsonData && !selectedRegion && (
            <GeoJSON
              data={geojsonData}
              style={{
                fillColor: "var(--secondary)",
                fillOpacity: 0.3,
                color: "black",
                weight: 1.5,
              }}
              eventHandlers={{
                click: (e) => {
                  const region = e.layer.feature;
                  setSelectedRegion(region);
                  //loadDistricts(region); 
                },
              }}
            />
          )}
  
          {/*  okresks */}
          {selectedRegion && (
            <ZoomToRegion
              region={selectedRegion}
              districts={districtsGeojsonData}
              onReset={() => {
                setSelectedRegion(null);
                setDistrictsGeojsonData(null);
              }}
            />
          )}
  
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
    );
  };
  
  const ZoomToRegion = ({ region, districts, onReset }) => {
    const map = useMap();
  
    useEffect(() => {
      if (region) {
        const bounds = L.geoJSON(region.geometry).getBounds();
        const center = bounds.getCenter();
        map.flyTo(center, 9, { duration: 0.5 });
      }
    }, [region, map]);
  
    const zoomToRepublic = () => {
      map.setView([49.7437572, 15.3386383], 8, { duration: 0.5 });
      onReset();
    };
  
    return (
      <>
        {/* Zvýrazněný kraj */}
        <GeoJSON
          data={region}
          style={{
            fillColor: "var(--secondary)",
            fillOpacity: 0.2,
            color: "black",
            weight: 2,
          }}
        />
  
        {/* Zobrazení okresů */}
        {districts && (
          <GeoJSON
            data={districts}
            style={{
              fillColor: "#f44336",
              fillOpacity: 0.3,
              color: "black",
              weight: 1,
            }}
          />
        )}
  
        <button onClick={zoomToRepublic} className="zoom-back-button">
          Zpět
        </button>
      </>
    );
  };
  
  export default Home;
  