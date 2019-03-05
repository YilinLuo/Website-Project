const mongoose = require('mongoose');

var wordSchema = new mongoose.Schema({
    value: String,
    score: Number,
    length: Number,
    letter: String
})

module.exports = mongoose.model("Word", wordSchema);
