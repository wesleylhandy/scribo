//node core element fs
const fs = require('fs');

//npm packages
const request = require('request');
const inquirer = require("inquirer");
const moment = require('moment');
const imdb = require('imdb-api');
const Twitter = require('twitter');
const Spotify = require('spotify');

//import object
const keys = require('./keys.js');
 
//new Twitter api call
const client = new Twitter(keys.twitterKeys);

//initialize twitter api variables
var screenName = keys.user.screen_name;
var params = {screen_name: screenName};

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
		screenName = user.name;
	
		client.get('statuses/user_timeline', {screen_name: screenName}, function(error, tweets, response) {
		  var logTimestamp = moment(new Date());
		  var logData = [logTimestamp, 'my-tweets'];
		  if (!error) {
		    // console.log(tweets);
		    
		    for (var i = 0; i < tweets.length; i++) {

		    	var timestamp = moment(new Date(tweets[i].created_at));
		    	console.log("");
		    	console.log(timestamp.format("dddd, MMMM Do YYYY, h:mm:ss a"));
		    	console.log("");
		    	console.log(tweets[i].text);
		    	console.log("");
		    	console.log("####################");
		    	console.log("####################");

		    	logData.push(timestamp,tweets[i].text);
		    }
		  } else {
		  	logData.push("my-tweets returned an error.");
		  }
		  updateLog(logData);
		});
	});
}

function postTweet() {

	if(!scriboData) {
		console.log("I am unable to understand what you want to be tweeted. Please tell me exactly what you want to say.");
		var logTimestamp = moment(new Date());
		var logData = [logTimestamp, 'tweet', 'No tweet data provided.'];
		updateLog(logData);
		return;
	}

	var logTimestamp = moment(new Date());
	var logData = [logTimestamp, 'tweet', scriboData];
	inquirer.prompt([
		{
			type: "confirm",
    		message: "Are you sure you want me to post " + scriboData + " for you?",
    		name: "confirm",
    		default: true
		}
	]).then(function(response){

		logData.push("User confirmed tweet = " + response.confirm);
		updateLog(logData);
		if (response.confirm) {

			client.post('statuses/update', {screen_name: screenName, status: scriboData},  function(error, tweet, response) {
			  if(error) {
			  	console.log(error);
			  	throw error;
			  }
			  console.log(response);
			  console.log("I just tweeted for you: ");
			  console.log(scriboData); 
			  // console.log(response);  // Raw response object.
			  
			});
		} else {
			console.log("Okay. I won't post this tweet.");
		}
	});	
}

function getSpotify() {

	if(!scriboData) {

		scriboData = "'The Sign' Ace of Base";
	}

	var logTimestamp = moment(new Date());
	var logData = [logTimestamp, 'spotify-this-song'];

	Spotify.search({ type: 'track', query: scriboData}, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        logData.push("Spotify Error!");
	        updateLog(logData);
	        return;
	    }
	    
	    var items = data.tracks.items;

	    var sorted = items.sort(function(a, b){ 
	    	return a.popularity - b.popularity;
	    });

	    var track = sorted[0];

	    var artistName = track.artists[0].name;
	    var trackName = track.name;
	    var previewLink = track.preview_url;
	    var albumName = track.album.name;

	    console.log("");
	    console.log("$$$$$$$$$$$$$$$$$$$$");
	    console.log("");
	    console.log("Track '" + trackName + ".'");
	    console.log("Recorded by '" + artistName + ".'");
	    console.log("On the Album '" + albumName + ".'");
	    console.log("Preview this song at - " + previewLink);
	    console.log("");
	    console.log("$$$$$$$$$$$$$$$$$$$$");
	    console.log("");
	    logData.push(trackName, artistName, albumName, previewLink);
	    updateLog(logData);
	});

}

function getMovie() {

	if(!scriboData) {

		scriboData = "Mr. Nobody";
	}
	var logTimestamp = moment(new Date());
	var logData = [logTimestamp, 'movie-this'];

	imdb.get(scriboData).then(function(things){

    	movie = things.Movie;

    	var title = movie.title;
    	var released = moment(new Date(movie.released));
    	var rated = movie.rated;
    	var rating = movie.rating;
    	var country = movie.country;
    	var language = movie.languages;
    	var plot = movie.plot;
    	var actors = movie.actors;

    	console.log("");
	    console.log("$$$$$$$$$$$$$$$$$$$$");
	    console.log("");
	    console.log(title);
	    console.log("Released on " + released.format("dddd, MMMM Do YYYY"));
	    console.log("Rated " + rated);
	    console.log("Starring " + actors);
	    console.log(plot);
	    console.log("IMDB User Rating (out of 10): " + rating);
	    console.log("Languages: " + language);
	    console.log("Produced in " + country);
	    console.log("");
	    console.log("$$$$$$$$$$$$$$$$$$$$");
	    console.log("");
	    logData.push(title, released, rated, actors, plot, rating, language, country);
	    updateLog(logData);
	}).catch(function(issue){
		console.log('Access to OMDB is unavailable.');
		logData.push("An error occured with OMDB.");
		updateLog(logData);
	});

	
}

function getRandomCommand() {
	var logTimestamp = moment(new Date());
	var logData = [logTimestamp, 'do-what-it-says'];

	fs.readFile('random.txt', 'utf-8', function(err, data) {
		if(err){
			console.log(err);
		} else {
			// console.log(data);
			var possibleSet = data.split("|");
			var randomIndex = Math.floor(Math.random() * possibleSet.length);
			var randomSet = possibleSet[randomIndex].split(",");
			var randomCommand = randomSet[0];
			if (randomSet[1]) {
				scriboData = randomSet[1].replace('"'/g, '');
			}
			logData.push(randomSet);
			updateLog(logData);
			callCommands(randomCommand);	
		}
	});
}

function updateLog(values) {
	if (!fs.existsSync('log.txt')) {
		fs.writeFileSync('log.txt', "|" + values);
	} else {
		fs.appendFile('log.txt', "|" + values, (err) => {
  			if (err) throw err;});
	}
}

function deleteLog() {
	fs.unlink('log.txt', function(err){
		if(err){
			console.log(err);
		} else {
			console.log("I have deleted the previous log information.");
			var logTimestamp = moment(new Date());
			var logData = [logTimestamp, "delete-log", "successful"];
			updateLog(logData);
		}
	});
}

function callCommands(command) {
	var delay; //initialize timeout variable;
	switch (command) {

		case 'tweet':
			console.log("I'll try to tweet something for you...");
			delay = setTimeout(postTweet,2000);
			break;

		case 'my-tweets':
			console.log("I'm going some get some tweets for you.");
			delay = setTimeout(getTweets, 2000);
			break;

		case 'spotify-this-song':
			console.log("I'm going to find song data for you.");
			delay = setTimeout(getSpotify, 2000);
			break;

		case 'movie-this':
			console.log("I'm going to find movie data for you.");
			delay = setTimeout(getMovie, 2000);
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
			console.log("Can you please repeat that? I do not understand what you are requesting.");
			console.log("!!!!!!!!!!!!!!!!!!!!");
			console.log("");
			var logTimestamp = moment(new Date());
			updateLog(logTimestamp, "User entered an invalid command.");
	}
}

callCommands(scriboCommand);