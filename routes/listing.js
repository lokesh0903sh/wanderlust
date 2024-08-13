const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listings = require("../models/listing.js");
const { isLoggedIn, validatelistings, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

router.get("/", wrapAsync(listingController.index));

//new route
router.get("/new", isLoggedIn,wrapAsync(listingController.newFormRender));

router.post("/", validatelistings,isLoggedIn, wrapAsync(listingController.createListing));

//show route
router.get("/:id", wrapAsync(listingController.showListing));

//edit route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.editListing)); 

router.put("/:id",isLoggedIn,isOwner, validatelistings, wrapAsync(listingController.updateListing));

//delete route
router.delete("/:id",isLoggedIn, isOwner,wrapAsync(listingController.deleteListing));

module.exports = router;