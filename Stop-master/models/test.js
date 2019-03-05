//this is the database file 

const mongoose = require('mongoose');

//connect to database
mongoose.connect("mongodb://user:stop123@ds123361.mlab.com:23361/stop");

//callback func/event listener -- listens for open connection
mongoose.connection.once("open", function(){
	console.log('DB connection made.');
}).on('error', function(){
	console.log('Error connection to DB:'.error);
});

const Schema = mongoose.Schema;

//create Schema
const TestSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date : {
        type: Date,
        default: Date.now
    }
});

module.exports = Test = mongoose.Model('test', TestSchema);
