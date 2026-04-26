import { useState, useEffect } from "react";
import MapComponent from "./components/MapComponent";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const url = searchTerm
      ? `http://localhost:4000/api/stores?state=${encodeURIComponent(searchTerm)}`
      : "http://localhost:4000/api/stores";

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched features:", data.features.length);

        const locs = data.features.map((f) => {
          const brand = f.properties.brand;
          const state = f.properties.state || "";
          const city = f.properties.city || "";

          return {
            rawBrand: brand, // keep original brand
            state,
            city,
            lat: f.geometry.coordinates[1],
            lng: f.geometry.coordinates[0],
          };
        });

        setLocations(locs);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, [searchTerm]);

  return (
    <div>
    {/*  <h2>POC Map Demo</h2> */}
      {/* <input
        type="text"
        placeholder="Filter by state"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      /> */}
      <MapComponent locations={locations} />
    </div>
  );
}

export default App;
