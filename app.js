const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const app = express();
const port = 8080;
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const ListingsRouter = require("./routes/listing.js");
const ReviewsRouter = require("./routes/reviews.js");
const UserRouter = require("./routes/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(cookieParser());
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


const sessionOptions ={
    secret: "mysecretstring",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7* 24 * 60 * 60 *1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/demoUser", async(req,res)=>{
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "student-delta",
    });

    let registeredUser = await User.register(fakeUser,"helloWorld");
    res.send(registeredUser);
});

app.use("/listings", ListingsRouter);
app.use("/listings/:id/reviews", ReviewsRouter);
app.use("/", UserRouter);

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

