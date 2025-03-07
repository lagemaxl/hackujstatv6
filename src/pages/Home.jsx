import {
    MapContainer,
    TileLayer,
    GeoJSON,
    useMap,
  } from "react-leaflet";
  import { useState, useEffect } from "react";
  import "./style/Home.css";
  import L from "leaflet";
  import { IconArrowLeft } from "@tabler/icons-react";
  
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
  
    const loadDistricts = async (region) => {
        try {
          const nationalCode = region.nationalCode;
      
          if (!nationalCode) {
            console.error("National code not found for the selected region.");
            return;
          }
      
          const response = await fetch(`${import.meta.env.VITE_API_URL}/kraje/${nationalCode}/okresy`, {
            headers: { accept: "application/json" },
          });
          const apiDistricts = await response.json();

          const localResponse = await fetch(`okresy.json`);
          const localDistrictsData = await localResponse.json();

          const validNationalCodes = apiDistricts.map((district) => district.kod.toString());

          const filteredDistricts = {
            type: "FeatureCollection",
            features: localDistrictsData.features.filter((feature) =>
              validNationalCodes.includes(feature.nationalCode)
            ),
          };
      
          setDistrictsGeojsonData(filteredDistricts);
        } catch (error) {
          console.error("Error loading districts:", error);
        }
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
                  loadDistricts(region); // Načtení okresů pro vybraný kraj
                },
              }}
            />
          )}
  
          {/* okresy */}
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
          <IconArrowLeft /> Zpět
        </button>
      </>
    );
  };
  
  export default Home;
  