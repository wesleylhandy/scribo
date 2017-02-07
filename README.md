# scribo
Scribo (or 'scribe' for short), is a Language Interpretation and Recognition Interface; More specifically, scribe is a a command line node.js application that takes in parameters and returns back data. Initially, Scribe uses node packages for Twitter, Spotify and IMBD to return recent tweets, song and movie information.

###Installation Instructions

From the command line:
`npm install`

###Scribo Setup

Before running the program, open 'keys.js' in your text-editor and enter your own personal twitter information.

Get your Twitter API keys by following these steps:

1. Step One: Visit https://apps.twitter.com/app/new
2. Step Two: Fill out the form with dummy data. Type http://google.com in the Website input. Don't fill out the Callback URL input. Then submit the form.
3. Step Three: On the next screen, click the Keys and Access Tokens tab to get your consumer key and secret.
	-Copy and paste them where the `<input here>` tags are inside your keys.js file.
4. Step Four: At the bottom of the page, click the Create my access token button to get your access token key and secret.
	-Copy the access token key and secret displayed at the bottom of the next screen. Paste them where the `<input here>` tags are inside your keys.js file.

Example code:

```javascript
exports.twitterKeys = {
  consumer_key: '<input here>',
  consumer_secret: '<input here>',
  access_token_key: '<input here>',
  access_token_secret: '<input here>'
}

exports.user = {
	screen_name: '<YOUR_TWITTER_HANDLE>'
}
```

###Scribo Commands

From the command line, you can run the following:

- `get-tweets`
>This will return your 20 most recent tweets

- `tweet <Tweet Content>`
>You can enter the content of a tweet directly following this command, else the default will ask you to enter your twitter screen name and then the content of your tweet via prompts.
>Hashtags are allowed if you place # inside quotes -> `'#'YOLO`.

- `spotify-this-song <Song Name>`
>Enter the name of the song for you desire to receive information from the Spotify database. Results are ordered by the popularity of the song, since song-titles are often reused dozens of times by various artists. Spotify will return a list of twenty songs, the most popular song of these titles will be displayed. To get more specific results, add the artist name after the title -> `Gravity Lecrae`
>Default results will display if no song-title entered.

- `movie-this <movie name>`
>Enter the name of a movie you desire to receive information from the IMDB database. The first result will be displayed.
>Default results will display if no movie-title entered.

- `do-what-it-says`
>This command will run a default command retrieved from an external .txt file.

- `clear-log`
>All commands and data are stored in log.txt. Calling clear will delete previous information and start the log fresh.

###Known Issues

Currently, IMDB does not provide a public API. Alternatively, the OMDBAPI (http://www.omdbapi.com) is currently experiencing problems and is unaccessible. :grimacing: (Date: 02/07/2017).