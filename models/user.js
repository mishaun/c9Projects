var mongoose = require("mongoose"),
    passportLocalMongoose = require ("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username : String,
    password: String
})

//plugin to use local mongoose strategy when authenticating?
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

