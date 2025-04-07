const Listing=require("../models/listing");
const getCoordinates = require('../utils/getCoordinates');



module.exports.index=async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings}); 
    }; 

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
  }

module.exports.showListing=async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
      path:"reviews",
      populate:{
        path:"author",
      },
    })
    .populate("owner");
  
    if(!listing){
      req.flash("error","Listing you requested doesn't exist")
      return res.redirect("/listings");
    }
    console.log(listing)
    res.render("listings/show.ejs",
      {listing,mapToken: process.env.MAP_TOKEN,},

    )
}

module.exports.createListing = async(req,res,next)=>{
  let url = req.file.path;
  let filename = req.file.filename;

  const coordinates = await getCoordinates(req.body.listing.location); // get lat/lon from location
  console.log("Coordinates for listing:", coordinates);

  if (!coordinates) {
    req.flash("error", "Invalid location. Please enter a valid place.");
    return res.redirect("/listings/new");
  }

  const newListing=new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image={url,filename};
  newListing.geometry = {
    type: "Point",
    coordinates: [
      parseFloat(coordinates.lon), 
      parseFloat(coordinates.lat)]
  };

  await newListing.save();
  req.flash("success","New Listing Created!!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you requested doesn't exist")
      res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
   originalImageUrl= originalImageUrl.replace("/upload", "/upload/h_300/w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
  };

  module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
  
    // Step 1: Update other listing details
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  
    // Step 2: If a new image was uploaded, update it
    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }
  
    // Step 3: Flash message and redirect
    req.flash("success", "Listing Updated!!");
    res.redirect(`/listings/${id}`);
  };
  

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing DELETED!!");
    res.redirect("/listings");
  }


