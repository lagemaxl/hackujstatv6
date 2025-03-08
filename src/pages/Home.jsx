import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import "./style/Home.css";
import L from "leaflet";
import { IconArrowLeft } from "@tabler/icons-react";
import { motion } from "motion/react";
import { Modal, Button } from "@mantine/core";

const Home = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [districtsGeojsonData, setDistrictsGeojsonData] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [lastFetchedRegion, setLastFetchedRegion] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    const firstVisit = localStorage.getItem("firstVisit");
    if (!firstVisit) {
      setModalOpened(true);
      localStorage.setItem("firstVisit", "true");
    }
  }, []);

  useEffect(() => {
    fetch(`kraje.json`)
      .then((response) => response.json())
      .then((data) => {
        setGeojsonData(data);
      });
  }, []);

  const loadDistricts = async (region) => {
    if (!region || region === lastFetchedRegion) return; // Fetchujeme pouze pokud je nový region

    try {
      const nationalCode = region.nationalCode;

      if (!nationalCode) {
        console.error("National code not found for the selected region.");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/kraje/${nationalCode}/okresy`,
        {
          headers: { accept: "application/json" },
        }
      );
      const apiDistricts = await response.json();

      const localResponse = await fetch(`okresy.json`);
      const localDistrictsData = await localResponse.json();

      const validNationalCodes = apiDistricts.map((district) =>
        district.kod.toString()
      );

      const filteredDistricts = {
        type: "FeatureCollection",
        features: localDistrictsData.features.filter((feature) =>
          validNationalCodes.includes(feature.nationalCode)
        ),
      };

      setDistrictsGeojsonData(filteredDistricts);
      setLastFetchedRegion(region); // Uložíme, že už jsme okresy pro tento kraj načetli
    } catch (error) {
      console.error("Error loading districts:", error);
    }
  };

  return (
    <div>
      <Modal opened={modalOpened} onClose={() => setModalOpened(false)}>
        <p>Zde můžete prozkoumat mapu krajů a okresů.</p>
        <Button onClick={() => setModalOpened(false)}>Pokračovat</Button>
      </Modal>

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
              setLastFetchedRegion(null);
            }}
            onFlyEnd={loadDistricts}
            eventHandlers={{
              click: (e) => {
                const region = e.layer.feature;
                console.log(region);
              },
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

const ZoomToRegion = ({ region, districts, onReset, onFlyEnd }) => {
  const map = useMap();

  useEffect(() => {
    if (region) {
      const handleMoveEnd = () => {
        onFlyEnd(region);
        map.off("moveend", handleMoveEnd);
      };

      map.flyToBounds(L.geoJSON(region).getBounds(), { duration: 0.5 });
      map.on("moveend", handleMoveEnd);
    }
  }, [region, map, onFlyEnd]);

  const zoomToDistrict = (district) => {
    map.flyToBounds(L.geoJSON(district).getBounds(), { duration: 0.5 });
    setSelectedDistrict(district);
  };

  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const zoomOutToRegion = () => {
    setSelectedDistrict(null);
    map.flyToBounds(L.geoJSON(region).getBounds(), { duration: 0.5 });
  };

  const zoomToRepublic = () => {
    map.setView([49.7437572, 15.3386383], 8, { duration: 0.5 });
    onReset();
  };


  return (
    <>
      {!selectedDistrict && (
        <GeoJSON
          data={region}
          style={{
            fillColor: "var(--secondary)",
            fillOpacity: 0.2,
            color: "black",
            weight: 1.5,
          }}
        />
      )}

      {districts && !selectedDistrict && (
        <GeoJSON
          data={districts}
          style={{
            fillColor: "var(--secondary)",
            fillOpacity: 0.2,
            color: "black",
            weight: 1,
          }}
          eventHandlers={{
            click: (e) => {
              const district = e.layer.feature;
              zoomToDistrict(district);
              console.log("Kliknutý okres:", district.nationalCode);
            },
          }}
        />
      )}

      {selectedDistrict && (
        <GeoJSON
          data={selectedDistrict}
          style={{
            fillColor: "var(--secondary)",
            fillOpacity: 0.4,
            color: "black",
            weight: 1.5,
          }}
        />
      )}

      <motion.button
        onClick={selectedDistrict ? zoomOutToRegion :  zoomToRepublic}
        className="zoom-back-button"
      >
        <IconArrowLeft /> {selectedDistrict ? "Zpět na kraj" : "Resetovat mapu"}
      </motion.button>

      <motion.div className="info-box">
        <h2>
          {selectedDistrict ? selectedDistrict.name : region.name}
          {selectedDistrict ? " (okres)" : " (kraj)"}
        </h2>
      </motion.div>
    </>
  );
};

export default Home;
