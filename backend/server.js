const fs = require("fs");
const csv = require("csv-parser");
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors()); // Enable CORS for all routes

const csvFilePath = path.join(__dirname, "my_pois.csv");

app.get("/api/stores", (req, res) => {
  const { state, brand } = req.query;
  const features = [];

  if (!fs.existsSync(csvFilePath)) {
    return res.status(404).json({ error: "CSV file not found at " + csvFilePath });
  }

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
      // 🚫 Skip rows missing both brand and state
      if (!row.brand_initial && !row.state) return;

      // Apply filters if provided
      if (state && row.state.toLowerCase() !== state.toLowerCase()) return;
      if (brand && row.brand_initial.toLowerCase() !== brand.toLowerCase()) return;

      features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)],
        },
        properties: {
          brand: row.brand_initial,
          state: row.state,
          city: row.city,
          zipcode: row.zipcode,
          status: row.status,
          type: row.type,
          channel: row.channel,
        },
      });
    })
    .on("end", () => {
      // ✅ Sample results to avoid overloading frontend
      const SAMPLE_SIZE = 1000;
      const sample = features.slice(0, SAMPLE_SIZE);

      res.json({ type: "FeatureCollection", features: sample });
    })
    .on("error", (err) => {
      console.error("Error reading CSV:", err);
      res.status(500).json({ error: "Failed to read CSV file" });
    });
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
