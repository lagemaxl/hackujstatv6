import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import { useState, useEffect } from "react";
import "./style/Home.css";

const Home = () => {
  const [geojsonData, setGeojsonData] = useState(null);

  const geoJSONStyle = (feature) => {
    return {
      fillColor: "#1976d2",
      fillOpacity: 0.1,
      color: "black",
      weight: 1.5,
    };
  };

  useEffect(() => {
    setGeojsonData(null);
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
        {geojsonData && (
          <GeoJSON
            data={geojsonData}
            style={geoJSONStyle}
            eventHandlers={{
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

export default Home;
