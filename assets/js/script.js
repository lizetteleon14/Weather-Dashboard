// Uses the OpenWeather API to retrieve weather data
var APIKey = "&appid=8c9bb7e0eeb10862d148cd62de471c05";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";

// Uses local storage to store persisent data 
var citiesArray = JSON.parse(localStorage.getItem("cities")) || [];
const m = moment();


$(document).ready(function() {
	var city = citiesArray[citiesArray.length - 1];
	fiveDay(city);
	citySearch(city);
});



function citySearch(city) {
	// clear out previous city data
	$(".city").empty();
	$(".temp").empty();
	$(".humidity").empty();
	$(".wind").empty();
	$(".uvIndex").empty();

	var citySearch = queryURL + city + APIKey;
	console.log(citySearch);

	// Display City Names
	$.ajax({
		url: citySearch,
		method: "GET"
	}).then(function(response) {
        // city name will also include the current date
		var cityInfo = response.name;
		var dateInfo = response.dt;
		var currentDate = moment.unix(dateInfo).format("L");
        
        
		// Where are we pulling the icons from and how
		var iconDummy = "https://openweathermap.org/img/wn/";
		var iconPng = "@2x.png";
		var iconWeather = response.weather[0].icon;
		var iconUrl = iconDummy + iconWeather + iconPng;
		console.log(iconUrl);
		var iconImg = $("<img>");
		iconImg.attr("src", iconUrl);
		$(".city").append(cityInfo + " ");
		$(".city").append(currentDate + " ");
		$(".city").append(iconImg);

		// Weather information will also include temperate, humidity, wind speed and UV index
		var K = response.main.temp;
		console.log(K);
		var F = ((K - 273.15) * 1.8 + 32).toFixed(0);
		console.log(F);
		$(".temp").append("Temperature: " + F + " °F");

		var humidityInfo = response.main.humidity;
		$(".humidity").append("Humidity: " + humidityInfo + "%");

		var oldSpeed = response.wind.speed;
		var newSpeed = (oldSpeed * 2.2369).toFixed(2);
		$(".wind").append("Wind Speed: " + newSpeed + " MPH");

		var lon = response.coord.lon;
		var lat = response.coord.lat;
		uvIndex(lon, lat);
	});
}

// UV INDEX Function 
function uvIndex(lon, lat) {
	// SEARCHES
	var indexURL =
		"https://api.openweathermap.org/data/2.5/uvi?appid=8c9bb7e0eeb10862d148cd62de471c05&lat=";
	var middle = "&lon=";
	var indexSearch = indexURL + lat + middle + lon;
	console.log(indexSearch);

	$.ajax({
		url: indexSearch,
		method: "GET"
	}).then(function(response) {
		var uvFinal = response.value;

		$(".uvIndex").append("UV Index: ");
		var uvBtn = $("<button>").text(uvFinal);
		$(".uvIndex").append(uvBtn);
		// UV Index changes color depending on level from 0-11
		if (uvFinal < 3) {
			// IF RETURN IS 0-2 SYLE GREEN
			uvBtn.attr("class", "uvGreen");
		} else if (uvFinal < 6) {
			// IF 3-5 STYLE YELLOW
			uvBtn.attr("class", "uvYellow");
		} else if (uvFinal < 8) {
			// IF 6-7 STYLE ORANGE
			uvBtn.attr("class", "uvOrange");
		} else if (uvFinal < 11) {
			// IF 8-10 STYLE RED
			uvBtn.attr("class", "uvRed");
		} else {
			// IF 11+ STYLE VIOLET
			uvBtn.attr("class", "uvPurple");
		}
	});
}



