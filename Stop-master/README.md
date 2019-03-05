CS210 Project: STOP
Group Members: Shagun Bose, Deirdre Kelliher, Yilin Luo

STOP is a game that challenges players to grow their vocabulary. The user can find the game on the website, which is deployed to Heroku app. There, they can choose to play either a single or a multiplayer game. Additionally, they can choose to sign up for an account, which allows their vocabulary and achievements to be stored. The game also includes fun animations!.

Game Features
* The STOP game is timed. Time remaining is shown by an animated bar. Once the game starts, an input line appears. 
* The game challenges the user to enter words beginning with a particular letter of the alphabet. Gamers can only earn points with words that start with that letter. For example, for “Enter words starting with letter z”, the game only accepts words such as “zeal”, “zest”, “zealous” etc. 
* The words are verified using the Oxford Dictionary API, in combination with our own checks. The game can filter out repeated words, words that don’t start with the given letter, and non-word strings. Bonus points are awarded to longer words.
* Game records for logged in users are stored in a MongoDB database, which is hosted on mLab. We use the database to track and manage user accounts and their game records. On their profile page, users can see their lifetime STOP vocabulary, sorted by letter.

Project Structure 
* The project is structured according to the MVC framework. 
* It was coded using Node.js and Express. It implements passport.js for authentication, as well as socket.io for multiplayer. * Currently, there are different routes and views for multiplayer and single player games. Single player runs along the “/new” route, using the “gameLogic” partial. Multiplayer runs along the “/newMultiDirector” → “/newMulti” route, using the “gameLogicMulti” partial. The multiplayer game logic implements socket.io, creating rooms for each party of players, and creating flags for relevant events, so that games can be synchronous. However, the team was not able to implement the last, most important, step of this, due to issues assigning players to rooms. So, socket.io rooms have full multiplayer capabilities, but only allow one player to join each one. 

Backend Routes 
 - / - landing page
 - /new - creates a new singleplayer game
 - /profile - shows user profile if logged in
 - /login - login
 - /signup - shows sign up page 
 - /check - validates a word with the external oxford api
 - /add - takes game data and adds it to the server
 - /* - returns 404 

Build requirements are as follows:
*Install Node.js
* Run in terminal:
  - npm install
  - npm install nodemon
  - npm start
OR go to http://stop-game.herokuapp.com/
