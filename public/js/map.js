if (
  typeof listingCoords !== "undefined" &&
  Array.isArray(listingCoords) &&
  listingCoords.length === 2
) {
  const map = L.map("map").setView([listingCoords[1], listingCoords[0]], 13); // lat, lng

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  L.marker([listingCoords[1], listingCoords[0]])
    .addTo(map)
    .bindPopup(mapPopupContent || "📍 Location")
    .openPopup();
} else {
  const mapDiv = document.getElementById("map");
  if (mapDiv) {
    mapDiv.innerHTML = "<p class='text-muted'>Map not available for this listing.</p>";
  }
}
