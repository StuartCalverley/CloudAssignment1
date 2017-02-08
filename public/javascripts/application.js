$( document ).ready(function(){

	$('#getLanLat').click(function() {
		//Get the address the user entered
		var address = $('#address').val();

		/**Makes an ajax call to the address route which will 
		 *return the longitude and latitude values of the address
		 */
		$.ajax({
			type: 'GET',
			url: '/address/',
			data: {address:address},
			success: function(output){
				var json = JSON.parse(output);

				if(json.status != "OK") {
					alert("WHAT");
				} else {
					var lng = json.results[0].geometry.location.lng;
					var lat = json.results[0].geometry.location.lat;
					//Calls the getWeather function and passes in the address longitude and latitude
					getWeather(lng, lat);
				}
			}
		});
	});




	$('#saveLocation').click(function() {
		var address = $('#address').val();
		/**Makes an ajax call to the address route which will 
		 *return the longitude and latitude values of the address
		 */
		$.ajax({
			type: 'GET',
			url: '/address/',
			data: {address:address},
			success: function(output) {
				var json = JSON.parse(output)
				if(json.status != "OK") {
					alert("ERROR!");
				} else {
					var lng = json.results[0].geometry.location.lng;
					var lat = json.results[0].geometry.location.lat;
					var email = sessionStorage.getItem('email')
					/**
					 * Saves the user's address they typed in into a database
					 */
					$.ajax({
						type: 'POST',
						url: '/saveLocation/',
						data: {lng:lng, lat:lat, email:email},
						success: function(output) {
							if(output == "SUCCESS") {
								alert("The address was successfully saved");
							} else {
								alert("There was an error saving the address");
							}
						}
					});
				}
			}
		});

	});

	/**
	 * Obtains the weather for the latitude and longitude cooridnates 
	 */
	function testAttempt(latitude, longitude,callback) {
		$.ajax({
			type: 'GET',
			url:'/address/weather/',
			data: {latitude:latitude, longitude:longitude},
			success: function(output) {
				callback(output, latitude, longitude);
			}
		});
	}

	$('#getLocations').click(function() {
		/**
		 * Obtains all the saved location that the user saved
		 */
		$.ajax({
			type: 'GET',
			url: '/getLocations/',
			data: {email: sessionStorage.getItem('email')},
			success: function(output) {
				var mapOptions = {
            	center: new google.maps.LatLng(42,-2),
            	zoom: 3
        		};
        		var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        		for(var i =0; i< output.length; i++) {
        			//Calls the function for every address the user saved
					testAttempt(output[i].latitude, output[i].longitude, function(values, latitude, longitude) {
						//Creates a marker on the map based off of the longitude and latitude and each marker contains the weather information
						//for the current day
						var myLatLng = {lat: latitude, lng: longitude};
						var json = JSON.parse(values);
						var weather = {high: json.query.results.channel.item.forecast[0].high, 
					   		low: json.query.results.channel.item.forecast[0].low,
					   		text: json.query.results.channel.item.forecast[0].text}; 
					   		var infowindow = new google.maps.InfoWindow({
			        			content: "Weather Status: "+ weather.text + "<br />High: "+ weather.high + "<br />Low: "+weather.low
			        		});

			        		var marker = new google.maps.Marker({
			        			position: myLatLng,
			        			map: map,
			        			title: 'Weather',
			        		});
			        		marker.addListener('click', function() {
			        			infowindow.open(map, marker);
			        		});
					});
				}

			}
		});
	});

 	function getWeather(lng, lat) {
 		var myLatLng = {lat: lat, lng: lng};
 		/**
 		 * Gets the weather based off of longitude and latitude
 		 */
 		$.ajax({
 			type: 'GET',
 			url: '/address/weather/',
 			data: {latitude: lat, longitude: lng},
 			success: function(output) {
 				var json = JSON.parse(output);
 				var weather = {high: json.query.results.channel.item.forecast[0].high, 
 							   low: json.query.results.channel.item.forecast[0].low,
 							   text: json.query.results.channel.item.forecast[0].text};
 				var mapOptions = {
            	center: new google.maps.LatLng(lat,lng),
            	zoom: 15
        		};
        		var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        		var infowindow = new google.maps.InfoWindow({
        			content: "Weather Status: "+ weather.text + "<br />High: "+ weather.high + "<br />Low: "+weather.low
        		});

        		var marker = new google.maps.Marker({
        			position: myLatLng,
        			map: map,
        			title: 'Weather',
        		});
        		marker.addListener('click', function() {
        			infowindow.open(map, marker);
        		});
        		infowindow.open(map, marker);

        		//Fills the table under the map with the weeks weather forecast
        		for(var i =0; i<7; i++) {
        			$("#day"+(i+1)).html(json.query.results.channel.item.forecast[i].date);
        		}
        		for(var i =0; i<7; i++) {
        			$("#condition"+(i+1)).html("<kbd>Condition:</kbd> "+json.query.results.channel.item.forecast[i].text);
        			$("#high"+(i+1)).html("<kbd>High:</kbd> "+json.query.results.channel.item.forecast[i].high);
        			$("#low"+(i+1)).html("<kbd>Low:</kbd> "+json.query.results.channel.item.forecast[i].low);
        		}
 			}
 		});
 	}

    /**
     * Reset the authentication setting it to null (more or less)
     */
 	$('#logout').click(function() {
 		sessionStorage.setItem("permission", "loggedOut");
 		sessionStorage.setItem("userName", "");
 		sessionStorage.setItem("email", "");
 		window.location.href="/";

 	});
});



