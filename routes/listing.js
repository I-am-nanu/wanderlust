const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn , isOwner, validateListing } = require("../middleware.js");
const listController = require("../controllers/listings.js");

const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); 



//index and create)
router.route("/")
    .get( wrapAsync(listController.index))
    .post(
      isLoggedIn, 
      upload.single('listing[image]'), 
      validateListing,
      wrapAsync(listController.createListing)
    );
    
router.get("/new", isLoggedIn, listController.renderNewForm);

//show, update && delete route
router.route("/:id") 
    .get(wrapAsync(listController.showListing))
    .put(
      isLoggedIn,
      isOwner, 
      upload.single('listing[image]'),
      validateListing, 
      wrapAsync(listController.updateListing)
    )
    .delete(
      isLoggedIn, 
      isOwner, 
      wrapAsync(listController.destroyListing)
    );

//edit route
router.get("/:id/edit", 
    isLoggedIn, 
    isOwner,
    wrapAsync(listController.renderEditForm));

module.exports = router;
