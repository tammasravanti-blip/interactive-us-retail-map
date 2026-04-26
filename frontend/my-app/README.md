# POC Map Demo

### Overview
Interactive map demo using Google Maps API with clustering, filtering, and marker popups. Backend serves store data from a large CSV file.

### Implemented Features
- Google Maps integration with provided API key
- Marker clustering using MarkerClusterer
- Filtering by state via search input
- InfoWindow popups on marker click
- Backend API serving CSV data as GeoJSON

### Future Enhancements
- Custom marker icons
- Advanced filtering (brand, status, channel)
- Styling improvements

### Design Decisions
- Initially implemented with Leaflet + OpenStreetMap to avoid billing friction.
- Updated to Google Maps API per task instructions.
- Clustering and filtering logic remain identical; only the map provider changed.

### Setup
1. Clone repo
2. Run `npm install`
3. Start backend: `node backend/server.js`
4. Start frontend: `npm start`
5. Open `http://localhost:3000`
