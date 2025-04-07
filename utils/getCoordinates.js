const axios = require('axios');

module.exports = async function getCoordinates(location) {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: location,
        format: 'json',
        limit: 1,
      },
      headers: {
        'User-Agent': 'WanderlustApp (Om Jain)',
      },
    });

    const data = response.data[0];
    if (!data) return null;

    return {
      lat: data.lat,
      lon: data.lon,
    };
  } catch (err) {
    console.error("Geocoding failed:", err.message);
    return null;
  }
};
