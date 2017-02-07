var fs = require('fs');
var request = require('request');
var inquirer = require("inquirer");
var keys = require('./keys.js');
var moment = require('moment');

var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});

var params = {screen_name: 'wesleylhandy'};
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