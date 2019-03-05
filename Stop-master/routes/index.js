var express = require("express");
var router = express.Router();
var request = require('request');
var User = require("../models/User.js");
var Word = require("../models/Word.js");
var middleware = require("../middleware");
var passport = require("passport");

//==========================
//ROOT ROUTE
//==========================
router.get('/', function(req, res){
  res.render("landing");
})

router.get('/new', function(req, res){
  res.render("new");
})

router.get('/newMultiDirector', function(req, res){
  res.render("newMultiDirector");
})

router.get('/newMulti', function(req, res){
  res.render("newMulti");
})

//signup
router.get('/signup', function(req, res){
  res.render("signup");
})

router.post('/signup', function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      req.flash("error", err.message);
      console.log(err.message)
      return res.redirect('signup');
    }else{
        passport.authenticate("local")(req, res, function(){
        res.redirect('/new');
      });
    }
  })
})

//login
router.get('/login', function(req, res){
  res.render("login");
})

router.post('/login', passport.authenticate("local", {
  successRedirect: '/new',
  failureRedirect: '/login',
  failureFlash: true
}), function(req, res){
})

//LOGOUT
router.get('/logout', function(req, res){
  req.logout();
  req.flash("success", "Loggged you out!")
  res.redirect('/');
})

//profile
router.get('/profile', isLoggedIn, function(req, res){
  res.render("profile");
})

//auth middleware
function isLoggedIn(req, res, next){
if(req.isAuthenticated()){
    console.log("isLoggedIn Middleware working")
    return next();
  }else{
    req.flash("error", "You need to be logged in.");
    res.redirect('login');
  }
}

//dictionary api
//id: 5eb4c6fb
//key: 43a9e1d650bf353b65e1bbfc3f9f9268
//This method checks if the word exists using Oxford Dictionary API
router.get('/check', function(req, res){
  var word = req.query.q;
  var url = "https://od-api.oxforddictionaries.com/api/v1/search/en?q=" + word + "&prefix=false&limit=1&regions=us";
  var options = {
    url: url,
    headers: {
      "Accept": "application/json",
      'app_id':'5eb4c6fb',
      'app_key':'43a9e1d650bf353b65e1bbfc3f9f9268'
    }
  };
  request.get(options, function(error, response, body){
    resBody = JSON.parse(body);
    res.send(body);
  })
})

//this method parses the game data and stores it accordingly.
router.post('/add', function(req, res){
    if(req.isAuthenticated()){
      var user = { id: req.user.id, username: req.user.username}
      var letter = req.header('letter')
      var score = req.header('score')
      //make list of "word" objects
      var header = req.header('words')
      var list = header.split(',')
      var words = [];
      for(var i = 0 ; i < list.length; i++){
        //create and add word to database
        var word = new Word({value:list[i], length: list[i].length, user: user, letter: letter});
        Word.create(word, function(err, word){if(err){console.log(err);} else {console.log("word added")}});
        //update user schema to include word and letter
        var uniqueword = {value:list[i], length: list[i].length, letter: letter}
        words.push(uniqueword);
      }
      //compare stored longest word and set longest word
      var newLongestWord = req.header('longestWord');
      var oldLongestWord = req.user.longestWord;
      var longestWord;
      if(oldLongestWord == undefined || oldLongestWord.length <= newLongestWord.length){
        longestWord = newLongestWord
      } else {
        longestWord = oldLongestWord
      }
      console.log("longest = " + longestWord)
      //values to update in user
      var update = {
        $addToSet: { words: {$each:words}, letters: letter},
        $set: {longestWord: longestWord}
      }
      //update user
      User.findByIdAndUpdate(req.user._id, update, function(err, user){
        if(err){
          console.log(err)
        } else {
          console.log("stuff added to user")
        }
      })

    } else {
        console.log("not logged in")
    }
})





//================================
// DON'T WRITE BELOW THIS LINE
//================================
router.get('*', function(req, res){
  res.render("404");
})

router.post('*', function(req, res){
  res.render("404");
})

module.exports = router;
