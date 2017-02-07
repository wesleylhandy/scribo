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
const client = new Twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});

//initialize twitter api variables
var screenName = keys.user.screen_name;
var params = {screen_name: screenName};

//get user arguments
const scriboCommand = process.argv[2];
var scriboData = process.argv.slice(3).join(" ");

function getTweets() {

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
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
	    }
	  }
	});
}

function postTweet() {

	if(!scriboData) {
		inquirer.prompt([
			{
				type: 'input',
				message: 'What is your Twitter Handle?',
				name: 'name'
			},
			{
				type: 'input',
				message: "Please Enter the Content of Your Tweet (limit 140 characters): ",
				name: 'content'
			}

		]).then(function(tweet){
			scriboData = tweet.content;
			screenName = tweet.name;
		});

	} 

	client.post('statuses/update', {screen_name: screenName, status: scriboData},  function(error, tweet, response) {
	  if(error) {
	  	console.log(error);
	  	throw error;
	  }
	  console.log("You're message has been tweeted!");  // Tweet body. 
	  // console.log(response);  // Raw response object. 
	});
	
}

function getSpotify() {

	if(!scriboData) {

		scriboData = "'The Sign' Ace of Base";
	}

	Spotify.search({ type: 'track', query: scriboData}, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
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

	    var noteBorder = '&#9834;&#9835;&#9834;&#9835;&#9834;&#9835;&#9834;&#9835;&#9834;&#9835;&#9834;&#9835;';
	    console.log("");
	    console.log(noteBorder);
	    console.log("");
	    console.log("Track '" + trackName + ".'");
	    console.log("Recorded by '" + artistName + ".'");
	    console.log("On the Album '" + albumName + ".'");
	    console.log("Preview this song at - " + previewLink);
	    console.log("");
	    console.log(noteBorder);
	    console.log("");
	});

}

switch (scriboCommand) {

	case 'tweet': 
		postTweet();
		break;

	case 'my-tweets':
		getTweets();
		break;

	case 'spotify-this-song':
		getSpotify();
		break;

	case 'movie-this':
		getMovie();
		break;

	default:
		console.log("");
		console.log("!!!!"); 
		console.log("Can you please repeat that? I do not understand what you are requesting.");
		console.log("!!!!");
		console.log("");
}