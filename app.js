const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Listings = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./utils/schema.js");
const Review = require("./models/review.js");
const {reviewSchema} = require("./utils/schema.js");
const app = express();
const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate); 

main().then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.listen(port,()=>{
    console.log(`server is listening to port: ${port}`)
})

const validatelistings = (req, res, next) => {
    let result = listingSchema.validate(req.body);
    if (result.error) {
      throw new ExpressError(400, result.error);
    } else {
      next();
    }
  };

  const validateReview = (req, res, next) => {
    let result = reviewSchema.validate(req.body);
    if (result.error) {
      throw new ExpressError(400, result.error);
    } else {
      next();
    }
  };

// listing route or main route
app.get("/listings", wrapAsync(async (req,res)=>{
    const allListings = await Listings.find({});
    res.render("listings/index.ejs", {allListings});
}));

//new route
app.get("/listings/new", wrapAsync((req,res)=>{
    res.render("listings/new.ejs");
}));

app.post("/listings", validatelistings, wrapAsync(async (req,res,next)=>{
        const newListing = new Listings(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
}));

//show route
app.get("/listings/:id", wrapAsync(async (req,res)=>{ 
    let {id} = req.params;
    const listing = await Listings.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));
//edit route
app.get("/listings/:id/edit", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listings.findById(id);
    res.render("listings/edit.ejs", {listing});
})); 

app.put("/listings/:id", validatelistings, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listings.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listing/:id",wrapAsync(async (req,res) =>{
    let {id} = req.params;
    await Listings.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//reviews 
//post route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req,res)=>{
    let listing = await Listings.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

app.all("*", (req,res,next)=>{
    next(new ExpressError(404, "page not found"));
});

app.use((err,req,res,next)=>{
    let {status = 500, message = "something went wrong"}  = err;
    res.status(status).render("error.ejs", {message});
});
app.get("/", (req,res)=>{
    res.send("working server");
});

