const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


var userSchema = new mongoose.Schema({
    //picture: Image
    username: String,
    password: String,
    longestWord: String,
    words: [],
    letters: []
    //return average of word score, highest scored word, total # words, total # games?? would need to attach
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
