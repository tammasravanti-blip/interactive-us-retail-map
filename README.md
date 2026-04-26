# Interactive US Retail Map

📌 Overview
This project visualizes US retail store locations on an interactive map.
It demonstrates full‑stack integration: backend serves store data from CSV → JSON, frontend renders aggregated markers with React + Google Maps API.

🛠 Tech Stack
Frontend: React, @react-google-maps/api
Backend: Node.js, Express, csv-parser
Data: CSV → JSON pipeline
Map Tiles: Google Maps JavaScript API


🚀 Features
Interactive map centered on the US
State circles with abbreviations + store counts
Black store markers with sequential numbering per state
Click‑to‑zoom drill‑down into city stores
Bounds fitting for clusters
Responsive full‑screen layout

⚙️ Setup Steps
Clone repo:
git clone https://github.com/tammasravanti-blip/interactive-us-retail-map
cd interactive-us-retail-map

Backend setup:
cd backend
npm install
npx nodemon server.js
API available at: http://localhost:4000/api/stores

Frontend setup:
cd frontend/my-app
npm install
npm start
App available at: http://localhost:3000

Environment setup:
Create a .env file in frontend/my-app
Add your Google Maps API key:
REACT_APP_GOOGLE_MAPS_KEY=AIzaSyDAnh7rtiiJWBSiT6f6eZit0qce9GNP0bc

Data Pipeline:
Input: stores.csv with columns (name, state, city, lat, lon)
Backend converts CSV → JSON
Frontend fetches JSON → renders markers

🌐 Compatibility
Tested successfully on Chrome (latest version)
Expected to work on other modern browsers (Edge, Firefox, Safari)
For best results, use Chrome

✅ Implemented Improvements
Migration from Leaflet → Google Maps API
State aggregation circles with counts
Custom marker styling (black dots with white borders)
Sequential numbering per state
City‑level drill‑down on marker click
Bounds fitting for reviewer clarity
Error handling for missing/invalid data



