const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listings = require("../models/listing.js");
const Review = require("../models/review.js");
let {isLoggedIn,validateReview, isOwner} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//reviews 
//Post route
router.post("/", isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

//Delete route

router.delete("/:reviewId",isLoggedIn,isOwner, wrapAsync(reviewController.deleteReview));

module.exports = router;