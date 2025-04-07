const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js")
const listingController = require("../controllers/listings.js")
const multer  = require('multer')
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage });


router
  .route("/")
  .get(wrapAsync(listingController.index))//Index ROute
  .post(                                   //Create route   
  isLoggedIn,
  upload.single('listing[image]'),
  validateListing, 
  wrapAsync(listingController.createListing)
  );
  
//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router
.route("/:id")                                   //show route
.get(wrapAsync(listingController.showListing))
.put(
  isLoggedIn,                                   //Update route
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.updateListing))
  .delete(                                     //DELETE rOUTE
    isLoggedIn,isOwner,
    wrapAsync(listingController.destroyListing)
  );

//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports=router;