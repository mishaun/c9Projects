var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware");

// route to view all campgrounds in array/database
router.get("/", function(req,res){
    Campground.find({}, function(err,allCampgrounds){ //getting all campgrounds from DB
        if(err){
            console.log(err)
        } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});  //passing in the variable campgrounds to campground page
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    
     //will get form data and add to db of campgrounds
     var newCamp = req.body.name; //taking entry in form with name = name
     var newImage = req.body.image; //taking entry from form with name = image
     var newDescript = req.body.descript;
     var price = req.body.price;
     var author = {
         id: req.user._id,
         username: req.user.username
     };
     
     var newCampObj = {name: newCamp, img: newImage, descript: newDescript, author: author, price: price}; //making new object with attributes name and img
     
     Campground.create(newCampObj,function(err,newCamp){
         if(err){
             console.log(err);
         } else{
             req.flash("success", "Campground Successfully Added");
             res.redirect("/campgrounds");
         }
     }); 
});
    
//route to the form page to add new camp ground.  ejs file is a form with two entries: camp name and image
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});    
    
//show route - routes to campground with individual information    
router.get("/:id", function(req,res){
    
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        if(err){
            console.log(err);
        } else{
              res.render("campgrounds/show", {campground: foundCamp});
        }
    });
});

//EDIT ROUTES

router.get("/:id/edit",middleware.checkOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/edit",{campground: campground});
        }
    })
});


//UPDATE ROUTE

router.put("/:id", middleware.checkOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            console.log(err);
        }else{
            req.flash("success", "Campground Updated")
            res.redirect("/campgrounds/" + updatedCampground._id);
        }
    });
});

//DELETE ROUTE

router.delete("/:id",middleware.checkOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err)
        }else{
            req.flash("success", "Campground Deleted")
            res.redirect("/campgrounds");
        }
    });
})




 module.exports = router; 