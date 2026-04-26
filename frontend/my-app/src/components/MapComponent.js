/* global google */
import { useEffect } from "react";

function MapComponent({ locations }) {
  useEffect(() => {
    if (!window.google) {
      console.error("Google Maps not loaded.");
      return;
    }

    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 39.8283, lng: -98.5795 },
      zoom: 4,
      mapTypeControl: true,
      zoomControl: true,
      streetViewControl: false,
    });

    // --- Group stores by state ---
    const stateGroups = {};
    locations.forEach((loc) => {
      if (!loc.state) return;
      if (!stateGroups[loc.state]) stateGroups[loc.state] = [];
      stateGroups[loc.state].push(loc);
    });

    // --- State summary markers ---
    const stateMarkers = Object.entries(stateGroups).map(([state, locs]) => {
      const avgLat = locs.reduce((sum, l) => sum + l.lat, 0) / locs.length;
      const avgLng = locs.reduce((sum, l) => sum + l.lng, 0) / locs.length;
      const count = locs.length;

      let abbrev = state.charAt(0).toUpperCase();
      abbrev += state.length >= 4
        ? state.charAt(3).toUpperCase()
        : state.charAt(state.length - 1).toUpperCase();

      return new google.maps.Marker({
        position: { lat: avgLat, lng: avgLng },
        map,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60">
              <circle cx="30" cy="30" r="28" fill="white" stroke="black" stroke-width="2"/>
              <text x="30" y="26" text-anchor="middle" font-size="14" font-family="Arial" fill="black">${abbrev}</text>
              <text x="30" y="46" text-anchor="middle" font-size="16" font-family="Arial" fill="red">${count}</text>
            </svg>`,
          scaledSize: new google.maps.Size(60, 60),
        },
      });
    });

    // --- Store markers (black dots with city-level click-to-zoom) ---
    const storeMarkers = [];
    Object.entries(stateGroups).forEach(([state, locs]) => {
      locs.forEach((loc, idx) => {
        const marker = new google.maps.Marker({
          position: { lat: loc.lat, lng: loc.lng },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "black",
            fillOpacity: 0.9,
            strokeColor: "white",
            strokeWeight: 2,
            scale: 10,
          },
          label: {
            text: String(idx + 1),
            color: "white",
            fontSize: "10px",
            fontWeight: "bold",
          },
        });

        // ✅ On click: zoom to all stores in THIS city
        marker.addListener("click", () => {
          // Hide state markers
          stateMarkers.forEach(m => m.setMap(null));
          // Hide all store markers
          storeMarkers.forEach(m => m.setMap(null));

          // Collect all stores in the same city + state
          const cityStores = locations.filter(
            s => s.city === loc.city && s.state === loc.state
          );

          const cityStoreMarkers = [];
          cityStores.forEach((s, i) => {
            const storeMarker = new google.maps.Marker({
              position: { lat: s.lat, lng: s.lng },
              map,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: "black",
                fillOpacity: 0.9,
                strokeColor: "white",
                strokeWeight: 2,
                scale: 10,
              },
              label: {
                text: String(i + 1),
                color: "white",
                fontSize: "10px",
                fontWeight: "bold",
              },
              title: s.rawBrand || `${s.city}, ${s.state}`,
            });
            cityStoreMarkers.push(storeMarker);
          });

          // Fit bounds to this city's stores
          const bounds = new google.maps.LatLngBounds();
          cityStoreMarkers.forEach(m => bounds.extend(m.getPosition()));
          if (!bounds.isEmpty()) {
            map.fitBounds(bounds);
          }
        });

        storeMarkers.push(marker);
      });
    });

    // --- Toggle layers on zoom ---
    google.maps.event.addListener(map, "zoom_changed", () => {
      const zoom = map.getZoom();
      if (zoom >= 7) {
        stateMarkers.forEach(m => m.setMap(null));
        storeMarkers.forEach(m => m.setMap(map));
      } else {
        storeMarkers.forEach(m => m.setMap(null));
        stateMarkers.forEach(m => m.setMap(map));
      }
    });

    // Initial render (zoom 4 → state circles)
    stateMarkers.forEach(m => m.setMap(map));

  }, [locations]);

  return <div id="map" style={{ height: "100vh", width: "100%" }} />;
}

export default MapComponent;
