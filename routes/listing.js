const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listings = require("../models/listing.js");
const { isLoggedIn, validatelistings } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

router.get("/", wrapAsync(listingController.index));

//new route
router.get("/new", isLoggedIn,wrapAsync(listingController.newFormRender));

router.post("/", validatelistings, wrapAsync(listingController.createListing));

//show route
router.get("/:id", wrapAsync(listingController.showListing));

//edit route
router.get("/:id/edit", wrapAsync(listingController.editListing)); 

router.put("/:id", validatelistings, wrapAsync(listingController.updateListing));

//delete route
router.delete("/:id",wrapAsync(listingController.deleteListing));

module.exports = router;