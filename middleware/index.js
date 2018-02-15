
var middlewareObj = {};
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId, function(err, comment){
            if(err){
                res.redirect("back");
            }else{ 
                if(comment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You Do Not Have Permission To Do This")
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "Please Login First")
        res.redirect("back");
    }
}

middlewareObj.checkOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, campground){
            if(err){
                res.redirect("back");
            }else{
                //.equals is used because campground.author.id is passed back as an object while req.user._id is a string
                if(campground.author.id.equals(req.user._id)){  
                    next();
                }else{
                    req.flash("error", "You Do Not Have Permission To Do This")
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "Please Login First")
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First");
    res.redirect("/login");
}

module.exports = middlewareObj;