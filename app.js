var express = require("express"),
    app = express(),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user"),
    flash = require("connect-flash"),
    SeedDB = require("./seed");

//requiring routes from different files 
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");


//connections and uses
mongoose.connect("mongodb://localhost/yelpcamp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");  
app.use(express.static(__dirname + "/public"));

//flash use
app.use(flash());

//passport configurations

app.use(require("express-session")({
    secret: "YelpCamp sessions",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//method override use
app.use(methodOverride("_method"));

 



// SeedDB(); //populating database with sample data

//database schemas

//middleware function that is called to pass every route the following variable: current user
//passing current user information to all routes for hiding certain nav bar items based on if user is logged in or not
app.use(function(req, res, next){
    res.locals.errorMessage = req.flash("error");
    res.locals.successMessage = req.flash("success");
    res.locals.currentUser = req.user;
    next();
});

//ROUTES

//telling app.js to use the routes required above 
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(indexRoutes);


    
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has Started");
});
    