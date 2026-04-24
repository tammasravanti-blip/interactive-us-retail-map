// MapView.js
// -----------------------------
// Frontend: React + Leaflet
// Features included:
// - Clustering of markers
// - Search/filter by state
// - Custom marker icons per state
// - Legend showing store counts per region
// - Error boundary for resilience
// -----------------------------

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import ErrorBoundary from "./ErrorBoundary"; // Error boundary component

// Fix Leaflet marker icons (Webpack issue workaround)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Custom icon generator based on state
function getCustomIcon(state) {
  let color = "blue"; // default color
  if (state === "Texas") color = "red";
  if (state === "California") color = "green";
  if (state === "New York") color = "orange";

  return new L.Icon({
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    className: `marker-${color}`, // CSS class for tint
  });
}

// Legend component showing store counts per state
function Legend({ counts }) {
  return (
    <div style={{
      position: "absolute",
      bottom: "10px",
      left: "10px",
      background: "white",
      padding: "10px",
      border: "1px solid gray"
    }}>
      <h4>Store Counts</h4>
      <ul>
        {Object.entries(counts).map(([state, count]) => (
          <li key={state}>{state}: {count}</li>
        ))}
      </ul>
    </div>
  );
}

export default function MapView() {
  const [stores, setStores] = useState([]);   // Store data from backend
  const [filter, setFilter] = useState("");   // Search filter input

  // Fetch store data from backend API
  useEffect(() => {
    fetch("http://localhost:4000/api/stores")
      .then((res) => res.json())
      .then((data) => setStores(data.features))
      .catch((err) => console.error("Failed to load stores", err));
  }, []);

  // Compute counts per state for legend
  const counts = stores.reduce((acc, store) => {
    const state = store.properties.state;
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {});

  return (
    <ErrorBoundary>
      {/* Search box to filter by state */}
      <input
        type="text"
        placeholder="Filter by state (e.g., Texas)"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ margin: "10px", padding: "5px" }}
      />

      {/* Map container centered on US */}
      <MapContainer center={[37.8, -96]} zoom={4} style={{ height: "90vh", width: "100%" }}>
        {/* OpenStreetMap tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Cluster group with zoom-to-bounds */}
        <MarkerClusterGroup chunkedLoading zoomToBoundsOnClick spiderfyOnMaxZoom>
          {stores
            .filter((store) =>
              filter ? store.properties.state.toLowerCase().includes(filter.toLowerCase()) : true
            )
            .map((store, idx) => (
              <Marker
                key={idx}
                position={[store.geometry.coordinates[1], store.geometry.coordinates[0]]}
                icon={getCustomIcon(store.properties.state)}
              >
                {/* Popup shows store name + state */}
                <Popup>{store.properties.name} - {store.properties.state}</Popup>
              </Marker>
            ))}
        </MarkerClusterGroup>

        {/* Legend showing counts */}
        <Legend counts={counts} />
      </MapContainer>
    </ErrorBoundary>
  );
}
