// Import required libraries
const express = require("express");   // Web framework
const cors = require("cors");         // Allow cross-origin requests
const fs = require("fs");             // File system access
const csv = require("csv-parser");    // Parse CSV files

const app = express();
app.use(cors()); // Enable frontend (localhost:3000) to call backend (localhost:4000)

let stores = []; // Array to hold store data

// Read CSV file and convert each row into GeoJSON format
fs.createReadStream("stores.csv")
  .pipe(csv())
  .on("data", (row) => {
    // Ensure lat/lon exist before pushing
    if (row.lat && row.lon) {
      stores.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [parseFloat(row.lon), parseFloat(row.lat)], // GeoJSON expects [lon, lat]
        },
        properties: {
          name: row.name,
          state: row.state,
        },
      });
    }
  })
  .on("end", () => {
    console.log("CSV loaded:", stores.length, "stores");
  });

// API endpoint to serve GeoJSON data
app.get("/api/stores", (req, res) => {
  if (!stores.length) {
    return res.status(500).json({ error: "No store data available" });
  }
  res.json({ type: "FeatureCollection", features: stores });
});

// Start backend server
const PORT = 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
