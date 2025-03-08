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
  const moveEndRef = useRef(false); // Použití useRef k zabránění duplicitního volání

  useEffect(() => {
    if (region) {
      const bounds = L.geoJSON(region.geometry).getBounds();
      const center = bounds.getCenter();

      map.flyTo(center, 9, { duration: 0.5 });

      if (!moveEndRef.current) {
        // Zabráníme opakovanému přidání listeneru
        moveEndRef.current = true;

        const handleMoveEnd = () => {
          onFlyEnd(region); // Zavoláme fetch okresů
          map.off("moveend", handleMoveEnd); // Odebereme event listener
          moveEndRef.current = false; // Resetujeme flag pro další interakci
        };

        map.on("moveend", handleMoveEnd);
      }
    }
  }, [region, map, onFlyEnd]);

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
            fillColor: "var(--secondary)",
            fillOpacity: 0.3,
            color: "black",
            weight: 1,
          }}
          eventHandlers={{
            click: (e) => {
              const district = e.layer.feature;
              console.log("Kliknutý okres:", district.nationalCode);
            },
          }}
        />
      )}

      <motion.button
        onClick={zoomToRepublic}
        className="zoom-back-button"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <IconArrowLeft /> Zpět
      </motion.button>

      <motion.div
        className="info-box"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h2>{region.name}</h2>
      </motion.div>
    </>
  );
};

export default Home;
