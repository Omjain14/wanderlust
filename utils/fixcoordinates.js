const mongoose = require("mongoose");
const axios = require("axios");
const Listing = require("../models/listing"); // Adjust path if needed

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.log(err));

async function geocodeLocation(locationStr) {
  const encoded = encodeURIComponent(locationStr);
  const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`;

  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent": "wanderlust-bot"
      }
    });
    if (res.data.length > 0) {
      const place = res.data[0];
      return [parseFloat(place.lon), parseFloat(place.lat)];
    }
  } catch (err) {
    console.error("Geocoding failed for:", locationStr);
  }

  return [];
}

async function fixListings() {
  const listings = await Listing.find({ "geometry.coordinates": { $size: 0 } });

  for (let listing of listings) {
    const locStr = `${listing.location}, ${listing.country}`;
    const coords = await geocodeLocation(locStr);

    if (coords.length === 2) {
      listing.geometry = {
        type: "Point",
        coordinates: coords,
      };
      await listing.save();
      console.log(`✅ Fixed: ${listing.title} => ${coords}`);
    } else {
      console.log(`❌ Could not geocode: ${listing.title}`);
    }
  }

  mongoose.connection.close();
}

fixListings();
