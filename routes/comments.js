var express = require("express"),
    router = express.Router({mergeParams: true}), //needed to get :id to be read
    Campground = require("../models/campground"),
    middleware = require("../middleware"),
    Comment = require("../models/comment");

//-----------------------------------------------
//comments routes
//-----------------------------------------------

router.get("/new", middleware.isLoggedIn, function(req,res){
    
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
});

router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               campground.comments.push(comment._id);
               campground.save();
               req.flash("success", "Successfully Added Comment")
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});



//EDIT COMMENT ROUTES

//edit form route

router.get("/:commentId/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.commentId, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {campgroundId: req.params.id, comment: foundComment});
        }
    });
});
           
//update route

router.put("/:commentId", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
        if(err){
            console.log(err);
        }else{
            req.flash("success", "Comment Updated");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//COMMENT DELETE ROUTE

router.delete("/:commentId", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.commentId, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Deleted Comment");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});


module.exports = router;