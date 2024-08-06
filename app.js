const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const app = express();
const port = 8080;
const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");

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

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

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

