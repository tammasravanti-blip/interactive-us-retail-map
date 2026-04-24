# Interactive US Retail Map

## 📌 Overview
This project visualizes US retail store locations on an interactive map.  
It demonstrates full-stack integration: backend serves store data from CSV → GeoJSON, frontend renders clustered markers with React + Leaflet.

## 🛠 Tech Stack
- **Frontend:** React, React-Leaflet, react-leaflet-cluster
- **Backend:** Node.js, Express, csv-parser
- **Data:** CSV → GeoJSON pipeline
- **Map Tiles:** OpenStreetMap (via Leaflet)

## 🚀 Features
- Interactive map centered on the US
- Store markers with popups (name + state)
- Clustering for performance and clarity
- Click-to-zoom clusters
- Responsive full-screen layout

## ⚙️ Setup Steps
1. Clone repo:
   ```bash
   git clone <repo-url>
   cd interactive-us-retail-map


2. Backend setup:
cd backend
npm install
node server.js

API available at http://localhost:4000/api/stores

3. Frontend setup:

cd frontend/my-app
npm install
npm start

App available at http://localhost:3000

Data Pipeline:
Input: stores.csv with columns (name, state, lat, lon)
Backend converts CSV → GeoJSON
Frontend fetches GeoJSON → renders markers

## 🌐 Compatibility
- Tested successfully on Chrome (latest version).
- Expected to work on other modern browsers (Edge, Firefox, Safari).
- For best results, use Chrome.

## ✅ Implemented Improvements
- Search/filter by state
- Custom marker icons per store type/state
- Legend showing store counts per region
- Error boundaries for resilience

## 🔮 Future Enhancements
- Search by store name
- Sidebar listing stores with zoom-to-marker
- Loading indicator during data fetch
- Mobile-friendly responsive layout
- Heatmap view for density visualization


