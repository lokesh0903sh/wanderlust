const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listings = require("../models/listing.js");
const Review = require("../models/review.js");
const {reviewSchema} = require("../utils/schema.js");

const validateReview = (req, res, next) => {
    let result = reviewSchema.validate(req.body);
    if (result.error) {
      throw new ExpressError(400, result.error);
    } else {
      next();
    }
  };

//reviews 
//Post route
router.post("/", validateReview, wrapAsync(async (req,res)=>{
    let listing = await Listings.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "Review Added!");
    res.redirect(`/listings/${listing._id}`);
}));

//Delete route

router.delete("/:reviewId",wrapAsync(async (req,res)=>{
    let {id, reviewId} = req.params;
    await Listings.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;