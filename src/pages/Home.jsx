import {
    MapContainer,
    TileLayer,
    GeoJSON,
    Marker,
    Popup,
    useMap,
  } from "react-leaflet";
  import { useState, useEffect } from "react";
  import "./style/Home.css";
  import L from "leaflet";
  
  const Home = () => {
    const [geojsonData, setGeojsonData] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);
  
    useEffect(() => {
      fetch(`kraje.json`)
        .then((response) => response.json())
        .then((data) => {
          setGeojsonData(data);
        });
    }, []);
  
    return (
      <div>
        <MapContainer
          center={[49.7437572, 15.3386383]}
          zoom={8}
          scrollWheelZoom={true}
          className="map"
        >
          {geojsonData && !selectedRegion && (
            <GeoJSON
              data={geojsonData}
              style={{
                fillColor: "#1976d2",
                fillOpacity: 0.3,
                color: "black",
                weight: 1.5,
              }}
              eventHandlers={{
                click: (e) => setSelectedRegion(e.layer.feature),
              }}
            />
          )}
  
          {selectedRegion && <ZoomToRegion region={selectedRegion} onReset={() => setSelectedRegion(null)} />}
  
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
    );
  };
  
  const ZoomToRegion = ({ region, onReset }) => {
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
        <GeoJSON
          data={region}
          style={{
            fillColor: "#1976d2",
            fillOpacity: 0.2,
            color: "black",
            weight: 2,
          }}
        />
        <button
          onClick={zoomToRepublic}
          className="zoom-back-button"
        >
          Zpět
        </button>
      </>
    );
  };
  
  export default Home;
  