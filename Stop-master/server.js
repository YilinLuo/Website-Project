const express = require('express'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      indexRoutes = require("./routes/index"),
      flash = require("connect-flash"),
      passport = require('passport'),
      localStrategy = require('passport-local'),
      request = require('request');
var User = require('./models/User.js');
var Word = require('./models/Word.js');
var Game = require('./models/Game.js');
const app = express();

// BodtParser Middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(flash());

//passport setup
app.use(require('express-session')({
    secret: "Stop Game",
    resave: false,
    saveUninitialized: false
   }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//'user' variable
app.use(function(req, res, next){
  res.locals.user = req.user;
  res.locals.error = req.flash("error")
  res.locals.success = req.flash("success")
  next();
})

//MongoDB URI
const db = require('./config/keys').mongoURI;

//connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err))

//Routes
//this is where we will set up the routes for the backend
app.use(indexRoutes);

//run server, set up socket.io
const port = process.env.PORT || 5000;
var server = require('http').createServer(app);
var io = require('socket.io')(server);


//socket.io flags, placeholders for now
var rooms = 0;

io.on('connection', (socket) => {

//handle create game
  socket.on('create game', function(data) {
    var roomID = ++rooms;
    socket.join(roomID);
    console.log(Object.keys(socket.rooms));
    console.log(roomID);
    socket.emit('new game', {name: data.name, room: roomID});
  });

//handle join game
  socket.on('join game', function(data) {
    var roomID = data.room;
    var roomAddress = io.nsps['/'].adapter.rooms[data.room];

    if(roomAddress != undefined) {
      socket.join(roomID);
      console.log(data.room);
      console.log(Object.keys(socket.rooms));
      socket.broadcast.to(roomID).emit('player has joined', {name: data.name, room: data.room });
    }
    else{
      console.log('bad room');
      socket.emit('err', {message: "Game is not available at this time."});
    }
  });

//alert game start
  socket.on('start game', function(data) {
    console.log(data);
    console.log(data.room);
    socket.emit('game started', data);
  });
//alert game stop
  socket.on('stop game', function(data) {
    socket.broadcast.to(data.room).emit('game stopped', data);
  });

});

server.listen(port, () => {
  console.log('Server is started on port:', port);
});