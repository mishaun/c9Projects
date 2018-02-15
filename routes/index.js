var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");
    

//home route with the landing.ejs page rendered
router.get("/", function(req,res){
    res.render("campgrounds/landing");
});




//authorization Routes

router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    //creating new user object to pass into User.register method
    var newUser = new User(
        {username: req.body.username
        });
        
    //User.register method takes three parameters - username, password, and callback function
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("register");
        }
        //method available from passport - logs user in after registering. "local" refers to the strategy used
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to YelpCamp, " + user.username);
           res.redirect("/campgrounds"); 
        });
    });
});

router.get("/login", function(req,res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),function(req, res){
    
});

router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Successfully Logged Out");
    res.redirect("/campgrounds");
})


module.exports = router;