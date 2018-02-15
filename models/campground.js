var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    img: String,
    descript: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        
        username: String
    }
    
});

//creates a collection in the db called "campgrounds" - confusing but it automatically makes it plural and lowercase 
//- exporting it to our app.js file to require and use

module.exports = mongoose.model("Campground", campgroundSchema);

