const mongoose = require("mongoose");
const Listing = require("./models/listing"); 

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
  .then(async () => {
      let listings = await Listing.find({});
      listings.forEach(listing => {
          console.log("Title:", listing.title);
          console.log("Image:", listing.image); // Check if image is missing
      });
      mongoose.connection.close();
  })
  .catch(err => console.log(err));
