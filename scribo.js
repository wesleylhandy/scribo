//node core element fs
const fs = require('fs');

//npm packages
const request = require('request');
const inquirer = require("inquirer");
const moment = require('moment');
// const imdb = require('imdb-api');
const Twitter = require('twitter');
const Spotify = require('spotify');

//import object
const keys = require('./twitterkeys.js');
 
//new Twitter api call
const client = new Twitter(keys.twitterKeys);


//get user arguments
const scriboCommand = process.argv[2];
var scriboData = process.argv.slice(3).join(" ");

function getTweets() {

	inquirer.prompt([
		{
			type: 'input',
			message: 'Whose tweets would you like to read?',
			name: 'name'
		}
	]).then(function(user) {
		logData.screenName = user.name;

	
		client.get('statuses/user_timeline', {screen_name: logData.screenName}, function(error, tweets, response) {

		  if (!error) {
		    // console.log(tweets);

		    logData.tweets = [];
		    
		    for (var i = 0; i < tweets.length; i++) {
		    	var tweetTimestamp = moment(new Date(tweets[i].created_at));
		    	var tweetText = tweets[i].text;
		    	logData.tweets.push({tweetTimestamp: tweetTimestamp, tweetText: tweetText});
		    	console.log("");
		    	console.log(logData.tweets[i].tweetTimestamp.format("dddd, MMMM Do YYYY, h:mm:ss a"));
		    	console.log("");
		    	console.log(logData.tweets[i].tweetText);
		    	console.log("");
		    	console.log("####################");
		    	console.log("####################");
		    }
		    logData.response = 'success';
		  } else {
		  	console.log("I could not retrieve any tweets for you. Did you tell me the right user-name?");
		  	logData.error = true;
		  	logData.errorText ="Unable to retrieve tweets for that account returned an error.";
		  }
		  updateLog(logData);
		});
	});
}

//disabled since keys are posted on github
function postTweet() {

	if(!scriboData) {
		console.log("I am unable to understand what you want to be tweeted. Please tell me exactly what you want to say.");
		logData.error = true;
		logData.errorText = 'No tweet data provided.';
		updateLog(logData);
		return;
	}

	
	logData.tweetText = scriboData;
	inquirer.prompt([
		{
			type: "confirm",
    		message: "Are you sure you want me to post " + scriboData + " for you?",
    		name: "confirm",
    		default: true
		}
	]).then(function(response){

		logData.response = "User confirmed tweet = " + response.confirm;
		
		if (response.confirm) {

			client.post('statuses/update', {status: scriboData},  function(error, tweet, response) {
			  if(error) {
			  	logData.error = true;
			  	logData.errorText = "Error occurred when posting tweet.";
			  	updateLog(logData);
			  	console.log("I could not post your tweet at this time.");
			  	throw error;
			  }
			  console.log("I just tweeted for you: ");
			  console.log(scriboData);
			  logData.response = 'success'; 
			  // console.log(response);  // Raw response object.
			  
			});
		} else {
			console.log("Okay. I won't post this tweet.");
		}
		updateLog(logData);
	});	
}

function getSpotify() {

	if(!scriboData) {

		scriboData = "'The Sign' Ace of Base";
	}

	Spotify.search({ type: 'track', query: scriboData}, function(err, data) {
	    if ( err ) {
	        console.log('I had trouble getting that information from Spotify.');
	        logData.error = true;
	        logData.errorText = "Spotify Error!";
	        updateLog(logData);
	        return;
	    }
	    
	    var items = data.tracks.items;

	    var sorted = items.sort(function(a, b){ 
	    	return a.popularity - b.popularity;
	    });

	    var track = sorted[0];

	    logData.artistName = track.artists[0].name;
	    logData.trackName = track.name;
	    logData.previewLink = track.preview_url;
	    logData.albumName = track.album.name;

	    console.log("");
	    console.log("$$$$$$$$$$$$$$$$$$$$");
	    console.log("");
	    console.log("Track '" + logData.trackName + ".'");
	    console.log("Recorded by '" + logData.artistName + ".'");
	    console.log("On the Album '" + logData.albumName + ".'");
	    console.log("Preview this song at - " + logData.previewLink);
	    console.log("");
	    console.log("$$$$$$$$$$$$$$$$$$$$");
	    console.log("");
	    logData.response = 'success';
	    updateLog(logData);
	});

}

function getMovie() {

	if(!scriboData) {

		scriboData = "Mr. Nobody";
	} 
	
	var movieReq = "http://www.omdbapi.com/?t=" + scriboData + "&y=&plot=short&tomatoes=true&r=json";

	// imdb.get(scriboData).then(function(things){

	request(movieReq, function(error, response, body) {

  // If there were no errors and the response code was 200 (i.e. the request was successful)...
		if (!error && response.statusCode === 200) {

		    var movie = JSON.parse(body);

	    	logData.title = movie.Title;
	    	logData.released = moment(new Date(movie.Released));
	    	logData.rated = movie.Rated;	    	
	    	logData.imdbRating = movie.imdbRating;	    	
	    	logData.country = movie.Country;	    	
	    	logData.language = movie.Language;
	    	logData.plot = movie.Plot;
	    	logData.actors = movie.Actors;
	    	logData.tomatoMeter = movie.tomatoMeter;
	    	logData.tomatoURL = movie.tomatoURL;

	    	console.log("");
		    console.log("$$$$$$$$$$$$$$$$$$$$");
		    console.log("");
		    console.log("____________________");
		    console.log("      " + logData.title);
		    console.log("____________________");
		    console.log("");
		    console.log("Rated " + logData.rated);
		    console.log("Starring " + logData.actors);
		    console.log("");
		    console.log("------Synopsis------");
		    console.log(logData.plot);
		    console.log("--------------------");
		    console.log("");
		    console.log("IMDB User Rating (out of 10): " + logData.imdbRating);
		    console.log("Rotten Tomatoes Critics Rating (out of 100): " + logData.tomatoMeter);
		    console.log(logData.tomatoURL);
		    console.log("");
		    console.log("Languages: " + logData.language);
		    console.log("Produced in " + logData.country);
		    console.log("Released on " + logData.released.format("dddd, MMMM Do YYYY"));
		    console.log("");
		    console.log("$$$$$$$$$$$$$$$$$$$$");
		    console.log("");
		    logData.response = 'success';
		    
		    
		
		} else {
			if (JSON.parse(error) == null) {
				console.log("When I asked about this movie, I was told that it could not be found in the database. Check your search terms and try again.");
			} else {
				console.log("I encountered an error with the OMDB database.");
			}

			logData.error= true;
			logData.errorText = "An OMDB error occurred.";

		}
		updateLog(logData);
	});

	
}

function getRandomCommand() {

	fs.readFile('random.txt', 'utf-8', function(err, data) {
		if(err){
			console.log('I would love to help you out, but you need to tell my creator I am missing something I really need.');
			logData.error = true;
			logData.errorText ='Unable to read file random.txt'
			updateLog(logData);
		} else {
			// console.log(data);
			var possibleSet = data.split("|");
			var randomIndex = Math.floor(Math.random() * possibleSet.length);
			var randomSet = possibleSet[randomIndex].split(",");
			var randomCommand = randomSet[0];
			if (randomSet[1]) {
				scriboData = randomSet[1].replace(/["]/g, '');
			}
			logData.command = scriboCommand;
			logData.randomSet = randomSet;
			callCommands(randomCommand);	
		}
	});
}

function updateLog(object) {
	if (!fs.existsSync('log.txt')) {
		fs.writeFileSync('log.txt', "[" + JSON.stringify(object) + "]");
	} else {
		fs.readFile('log.txt', 'utf-8', (err, data) => {
			if (err) {
				console.log(err);
			}

			var arr = JSON.parse(data);

			arr.push(object);

			fs.writeFile('log.txt', JSON.stringify(arr), (err) => {
  				if (err) throw err;
  			});
			
		});
	}
}

function deleteLog() {
	fs.unlink('log.txt', function(err){
		if(err){
			console.log('I tried to delete the log, but something I cannot see is stopping me.');
			logData.error =true;
			logData.errorText = "Unable to delete file."
		} else {
			console.log("I have deleted the previous log information.");
			logData.response = "success";
			
		}
		updateLog(logData);
	});
}

function callCommands(command) {
	var delay; //initialize timeout variable;
	switch (command) {

		case 'tweet':
			console.log("I'll try to tweet something for you...");
			delay = setTimeout(postTweet,1000);
			break;

		case 'my-tweets':
			console.log("I'm going some get some tweets for you.");
			delay = setTimeout(getTweets, 1000);
			break;

		case 'spotify-this-song':
			console.log("I'm going to find song data for you.");
			delay = setTimeout(getSpotify, 1000);
			break;

		case 'movie-this':
			console.log("I'm going to find movie data for you.");
			delay = setTimeout(getMovie, 1000);
			break;

		case 'do-what-it-says':
			console.log("I've got just the thing for this situaion...");
			getRandomCommand();
			break;

		case 'clear-log':
			console.log("Let me start the process for deleting the log.");
			deleteLog();
			break;

		default:
			console.log("");
			console.log("!!!!!!!!!!!!!!!!!!!!"); 
			console.log("");
			console.log("Can you please repeat that? I do not understand what you are requesting.");
			console.log("You can ask me to do one of the following:");
			console.log("");
			console.log("'tweet' 'your-message-goes here' to post something to twitter.");
			console.log("'my-tweets' to retrieve tweets from any twitter user.");
			console.log("'spotify-this-song' 'song-title-of-your-choice' to retrieve data on any one song.");
			console.log("'movie-this' 'movie-title-of-your-choice' to retreive data on any one movie.");
			console.log("'do-what-it-says' to allow me to randomly choose a command for you.");
			console.log("'clear-log' to reset the log.txt file - don't do this unless you are really sure!");
			console.log("");
			console.log("!!!!!!!!!!!!!!!!!!!!");
			console.log("");
			logData.error= true;
			logData.errorText = "User entered an invalid command.";
			updateLog(logData);
	}
}

var logTimestamp = moment(new Date());
var logData = {logTimestamp: logTimestamp, command: scriboCommand, error: false};
callCommands(scriboCommand);