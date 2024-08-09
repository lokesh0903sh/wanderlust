const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../utils/schema.js");
const Listings = require("../models/listing.js");

const validatelistings = (req, res, next) => {
    let result = listingSchema.validate(req.body);
    if (result.error) {
      throw new ExpressError(400, result.error);
    } else {
      next();
    }
  };

router.get("/", wrapAsync(async (req,res)=>{
    const allListings = await Listings.find({});
    res.render("listings/index.ejs", {allListings});
}));

//new route
router.get("/new", wrapAsync(async(req,res)=>{
    res.render("listings/new.ejs");
}));

router.post("/", validatelistings, wrapAsync(async (req,res,next)=>{
        const newListing = new Listings(req.body.listing);
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
}));

//show route
router.get("/:id", wrapAsync(async (req,res)=>{ 
    let {id} = req.params;
    const listing = await Listings.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));

//edit route
router.get("/:id/edit", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listings.findById(id);
        if(!listing){
            req.flash("error", "Listing you requested for does not exist!");
            res.redirect("/listings");
        }
    res.render("listings/edit.ejs", {listing});
})); 

router.put("/:id", validatelistings, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listings.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",wrapAsync(async (req,res) =>{
    let {id} = req.params;
    await Listings.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;