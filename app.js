const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Listings = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
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

app.get("/listings", async (req,res)=>{
    const allListings = await Listings.find({});
    res.render("listings/index.ejs", {allListings});
});

app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
});

app.post("/listings",async (req,res)=>{
    const newListing = new Listings(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})

app.get("/listings/:id", async (req,res)=>{ 
    let {id} = req.params;
    const listing = await Listings.findById(id);
    res.render("listings/show.ejs", {listing});
});

app.get("/listings/:id/edit", async (req,res)=>{
    let {id} = req.params;
    const listing = await Listings.findById(id);
    res.render("listings/edit.ejs", {listing});
}); 

app.put("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    await Listings.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});

app.delete("/listing/:id",async (req,res) =>{
    let {id} = req.params;
    await Listings.findByIdAndDelete(id);
    res.redirect("/listings");
});
app.get("/", (req,res)=>{
    res.send("working server");
});

