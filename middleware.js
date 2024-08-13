const Listings = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./utils/schema.js");

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create Listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listings.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You don,t have permision to changes");
        return res.redirect(`/listings/${id}`)
    }
    next();
};

module.exports.validatelistings = (req, res, next) => {
    let result = listingSchema.validate(req.body);
    if (result.error) {
      throw new ExpressError(400, result.error);
    } else {
      next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let result = reviewSchema.validate(req.body);
    if (result.error) {
      throw new ExpressError(400, result.error);
    } else {
      next();
    }
  };
