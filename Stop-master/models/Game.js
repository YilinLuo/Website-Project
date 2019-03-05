const mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({
    word: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Word"
        }
    }],
    user: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }],
    //date: DATETIME for profiles
    //highscore: Number???? winner??
    //_id will give a unique game id, this is built in to mongoDB
})

module.exports = mongoose.model("Game", gameSchema);