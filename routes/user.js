const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");

router.get("/signUp", (req,res)=>{
    res.render("users/signUp.ejs");
});

router.post("/signUp", wrapAsync(async(req,res)=>{
    try{let {username, email, password} = req.body;
    let NewUser = new User({
        email,username
    });
    const registeredUser = await User.register(NewUser, password);
    console.log(registeredUser);
    req.flash("success", "Welcome to Wanderlust!");
    res.redirect("/listings");}
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signUp");
    }
}));

module.exports = router;