var express = require('express');
var router = express.Router();
var rp = require('request-promise');
var unirest = require('unirest');

//The api key for the google api
var apiKey = "AIzaSyC7-_GsvB9U5OC1891LqKmF2PqRbyU4JBA";

router.get('/', function(req, res, next) {
  var address = req.query.address;
  //Makes a call to googleapis by passing in the api key and address
  //returns the longitude and latitude of the address
  var options = {
  	uri: "https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key="+apiKey
  };

  rp(options).then(function (result) {
  	//Sends the informatin back to the front-end where it will be processed
  	res.status(200).json(result);
  }).catch(function(error) {
  	console.log("error: "+ error);
  });
});



router.get('/weather', function(req,res,next) {
	var lng = req.query.longitude;
	var lat = req.query.latitude;
	//Makes a call to the weather API and passes in the longitude and latitude
	var options = {
		uri: "https://simple-weather.p.mashape.com/weatherdata?lat="+lat+"&lng="+lng,
		//Sets the headers in the request with the API key
		headers: {
			'X-Mashape-Key': 'shcHOQZGm0mshVbiDu8PpcIe0eKip1wMh2EjsnFrqq7UTPiRiG',
			'Accept': 'application/json'
		}
	};
	rp(options).then(function (result) {
		//Sends the weather information that relates to the longitude and latitude cooridnates
		res.status(200).json(result);
	}).catch(function(error) {
		console.log("error: "+ error);
	});

});

module.exports = router;
