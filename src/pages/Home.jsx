import { MapContainer, TileLayer, GeoJSON, useMap, Popup } from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import "./style/Home.css";
import L from "leaflet";
import { Marker } from "react-leaflet";
import { IconArrowLeft, IconSchool } from "@tabler/icons-react";
import {
  IconUsers,
  IconChalkboard,
  IconDeviceDesktop,
  IconDeviceLaptop,
  IconWifi,
  IconFileDescription,
  IconPercentage,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { Modal, Button, Table, Checkbox, Input } from "@mantine/core";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { div } from "framer-motion/client";

const Home = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [districtsGeojsonData, setDistrictsGeojsonData] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [lastFetchedRegion, setLastFetchedRegion] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    const firstVisit = localStorage.getItem("firstVisit");
    if (!firstVisit) {
      localStorage.setItem("firstVisit", "true");
      setModalOpened(true);
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
    if (!region || region === lastFetchedRegion) return;

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
      setLastFetchedRegion(region);
    } catch (error) {
      console.error("Error loading districts:", error);
    }
  };

  return (
    <div>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Vítejte!"
        size={"xl"}
        centered
      >
        <p>
          Vítejte na mapě škol, tato aplikace slouží jako pomocník při hledání
          Vaší vysněné školy. Můžete zde najít jak je škola financovaná, kolik
          má učeben či počet uchazečů.
        </p>
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
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [schools, setSchools] = useState([]);
  const [schoolDetails, setSchoolDetails] = useState(null);
  const [schoolFinance, setSchoolFinance] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([
    "Mateřská škola",
    "Základní škola",
    "Střední škola",
    "Vyšší odborná škola",
  ]);

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

  const fetchSchools = async (district) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/school/${district.nationalCode}`,
        {
          headers: { accept: "application/json" },
        }
      );
      const schoolData = await response.json();
      setSchools(schoolData);
    } catch (error) {
      console.error("Chyba při načítání škol:", error);
      setSchools([]);
    }
  };

  const zoomToDistrict = (district) => {
    map.flyToBounds(L.geoJSON(district).getBounds(), { duration: 0.5 });
    setSelectedDistrict(district);
    fetchSchools(district);
  };

  useEffect(() => {
    if (region.name == "Hlavní město Praha") {
      districts && zoomToDistrict(districts.features[0]);
    }
  }, [selectedDistrict, districts]);

  const zoomOutToRegion = () => {
    setSearchQuery("");
    setSelectedDistrict(null);
    setSchools([]);
    map.flyToBounds(L.geoJSON(region).getBounds(), { duration: 0.5 });
  };

  const zoomToRepublic = () => {
    map.setView([49.7437572, 15.3386383], 8, { duration: 0.5 });
    onReset();
  };

  const SkolkaIcon = L.icon({
    iconUrl: "./icon/skolka.webp",
    iconSize: [27, 37],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const ZakladkaIcon = L.icon({
    iconUrl: "./icon/zakladka.webp",
    iconSize: [27, 37],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const StredniIcon = L.icon({
    iconUrl: "./icon/stredni.webp",
    iconSize: [27, 37],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const VejskaIcon = L.icon({
    iconUrl: "./icon/vejska.webp",
    iconSize: [27, 37],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const fetchSchoolDetails = async (redIzo) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/school/red_izo/${redIzo}`,
        { headers: { accept: "application/json" } }
      );
      const data = await response.json();
      setSchoolDetails(data);
    } catch (error) {
      console.error("Chyba při načítání detailů školy:", error);
    }
  };

  const fetchSchoolFinance = async (redIzo) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/school/finance/2312/${redIzo}`,
        { headers: { accept: "application/json" } }
      );
      const data = await response.json();
      setSchoolFinance(data);
    } catch (error) {
      console.error("Chyba při načítání financí školy:", error);
    }
  };

  const formatCurrency = (amount) => {
    if (amount == null) return "N/A";
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredSchools = schools.filter((school) =>
    selectedCategories.includes(school.zarizeni)
  );

  const filteredSchoolsInput = filteredSchools.filter((school) =>
    school.nazev.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/*
{selectedDistrict && (
 <div className="school-info">
  <h3>Školy v okrese {selectedDistrict.name}</h3>
  <ul>
    {schools.map((school, index) => (
      <li key={index}>
        <IconSchool /> {school.nazev} ({school.zarizeni})
      </li>
    ))}
  </ul>
 </div> 
)}
*/}

      {schoolDetails && (
        <Modal
          opened={Boolean(schoolDetails)}
          onClose={() => setSchoolDetails(null)}
          title={"Detail školy"}
          size={"xl"}
          centered
        >
          <div className="school-info">
            {schoolDetails && (
              <div>
                <h1>
                  <strong>{schoolDetails.nazev || "N/A"}</strong>
                </h1>
                <p>
                  <strong>IČO:</strong> {schoolDetails.ico || "N/A"}
                </p>
                <p>
                  <strong>RED IZO:</strong> {schoolDetails.red_izo || "N/A"}
                </p>
                <p>
                  <strong>Ředitel:</strong> {schoolDetails.head_name || "N/A"}
                </p>
                <Table>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td>
                        <IconUsers size={24} />
                      </Table.Td>
                      <Table.Td>
                        <strong>Počet studentů</strong>
                      </Table.Td>
                      <Table.Td>
                        {schoolDetails.pocet_studentu ?? "N/A"}
                      </Table.Td>
                    </Table.Tr>
                    {/*  */}
                    {schoolDetails.prihlaseni_cj && (
                      <Table.Tr>
                        <Table.Td>
                          <IconFileDescription size={24} />
                        </Table.Td>
                        <Table.Td>
                          <strong>Počet podaných přihlášek</strong>
                        </Table.Td>
                        <Table.Td>{schoolDetails.prihlaseni_cj}</Table.Td>
                      </Table.Tr>
                    )}
                    {/*  */}
                    {schoolDetails.percent_cj && (
                      <Table.Tr>
                        <Table.Td>
                          <IconPercentage size={24} />
                        </Table.Td>
                        <Table.Td>
                          <strong>Průměrné percentilové umístění</strong>
                        </Table.Td>
                        <Table.Td>{schoolDetails.percent_cj} % </Table.Td>
                      </Table.Tr>
                    )}
                    {/*  */}
                    <Table.Tr>
                      <Table.Td>
                        <IconChalkboard size={24} />
                      </Table.Td>
                      <Table.Td>
                        <strong>Počet učeben</strong>
                      </Table.Td>
                      <Table.Td>{schoolDetails.pocet_uceben ?? "N/A"}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <IconDeviceDesktop size={24} />
                      </Table.Td>
                      <Table.Td>
                        <strong>Počet PC</strong>
                      </Table.Td>
                      <Table.Td>{schoolDetails.pocet_pc ?? "N/A"}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <IconDeviceLaptop size={24} />
                      </Table.Td>
                      <Table.Td>
                        <strong>Počet notebooků</strong>
                      </Table.Td>
                      <Table.Td>
                        {schoolDetails.pocet_notebook ?? "N/A"}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <IconWifi size={24} />
                      </Table.Td>
                      <Table.Td>
                        <strong>WiFi</strong>
                      </Table.Td>
                      <Table.Td>
                        {schoolDetails.wifi != null
                          ? schoolDetails.wifi
                            ? "Ano"
                            : "Ne"
                          : "N/A"}
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </div>
            )}
            {schoolFinance && (
              <>
                <h3>Finanční informace</h3>
                <div className="school-finance">
                  {schoolFinance.aktiva > 0 && (
                    <p>
                      <strong>Aktiva:</strong>{" "}
                      <span>{formatCurrency(schoolFinance.aktiva)}</span>
                    </p>
                  )}
                  <p>
                    <strong>Roční příjmy:</strong>{" "}
                    <span className="green">
                      {formatCurrency(schoolFinance.vynosy)}
                    </span>
                  </p>
                  <p>
                    <strong>Roční náklady:</strong>{" "}
                    <span className="red">
                      {formatCurrency(schoolFinance.naklady)}
                    </span>
                  </p>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}

      {selectedDistrict && (
        <Input
          placeholder="Hledej školu!"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="school-search"
        />
      )}

      {selectedDistrict && (
        <Checkbox.Group
          label="Filtr škol podle kategorie"
          value={selectedCategories}
          onChange={setSelectedCategories}
          className="school-filter"
        >
          <Checkbox
            value="Mateřská škola"
            label="Mateřská škola"
            color="#ff5703"
          />
          <Checkbox
            value="Základní škola"
            label="Základní škola"
            color="#3332fb"
          />
          <Checkbox
            value="Střední škola"
            label="Střední škola"
            color="#21b710"
          />
          <Checkbox
            value="Vyšší odborná škola"
            label="Vyšší odborná škola"
            color="#8b08ef"
          />
        </Checkbox.Group>
      )}

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

      <MarkerClusterGroup>
        {filteredSchoolsInput &&
          filteredSchoolsInput.map((school, index) => {
            let icon;
            switch (school.zarizeni) {
              case "Mateřská škola":
                icon = SkolkaIcon;
                break;
              case "Základní škola":
                icon = ZakladkaIcon;
                break;
              case "Střední škola":
                icon = StredniIcon;
                break;
              case "Vyšší odborná škola":
                icon = VejskaIcon;
                break;
              default:
                icon = SkolkaIcon;
            }

            return (
              <Marker
                key={index}
                position={[school.lantitude, school.lontitude]}
                icon={icon}
                eventHandlers={{
                  click: () => {
                    fetchSchoolDetails(school.red_izo);
                    fetchSchoolFinance(school.red_izo);
                  },
                }}
              ></Marker>
            );
          })}
      </MarkerClusterGroup>

      {selectedDistrict && selectedDistrict.nationalCode == "3812" ? (
        <motion.button onClick={zoomToRepublic} className="zoom-back-button">
          <IconArrowLeft />
          Resetovat mapu
        </motion.button>
      ) : (
        <motion.button
          onClick={selectedDistrict ? zoomOutToRegion : zoomToRepublic}
          className="zoom-back-button"
        >
          <IconArrowLeft />{" "}
          {selectedDistrict ? "Zpět na kraj" : "Resetovat mapu"}
        </motion.button>
      )}

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
