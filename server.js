var config = require('./credentials/config.js');

var KEEN_PROJECT_ID = config.keen.project_id;
var KEEN_WRITE_KEY = config.keen.write_key;
var WEATHER_APP_KEY = config.weather.app_key;
var CHECK_TEMPS_INTERVAL = 300000;	// 300000 milliseconds = 5 minutes

var wifi = require('wifi-cc3000');
var tessel = require('tessel');
var climatelib = require('climate-si7020');
var climate = climatelib.use(tessel.port['A']);
var request = require('request');

var Keen = require('keen.io');
var keen_client = Keen.configure({projectId: KEEN_PROJECT_ID, writeKey: KEEN_WRITE_KEY});

wifi.reset(function() {		
	// resetting wifi to clear state from any previous operations that didn't finish
	console.log('wifi reset');

	wifi.on('connect', function() {
		console.log('wifi connected');
	});
});

wifi.on('disconnect', function(data) {
	console.log('wifi disconnected:');
	console.log(data);
	setTimeout(function() { wifi.connect(); }, 20000);
});

wifi.on('error', function(err) {
	console.log('wifi emitted error:');
	console.log(err);
});

climate.on('ready', function() {
	console.log('Connected to climate module');

	setInterval(function(){ 
		climate.readTemperature('f', function(err, temp) {
			if (!err) {
				var room_temp = Math.round(temp);
				var outside_temp;

				if (wifi.isConnected()) {
					request.get('http://api.wunderground.com/api/' + WEATHER_APP_KEY + '/conditions/q/WA/Seattle.json', function(error, response, body) {
						if (!error && response.statusCode == 200) {
							outside_temp = Math.round(JSON.parse(body).current_observation.temp_f);

							keen_client.addEvents({
								"outside temperatures": [{"temperature": outside_temp}],
								"inside temperatures": [{"temperature": room_temp}]
							}, function(k_err) {
								if (k_err){
									console.log("Error posting to Keen event:");
									console.log(k_err)
								}
							});
						};
					}).on('error', function(e) {
						console.log('http module error');
						console.log(e);
					});
				} else {
					console.log('Did not post to Keen - wifi disconnected');
				}
			} else {
				console.log('Error reading temperature from climate module');
				console.log(err);
			}
		});
	}, CHECK_TEMPS_INTERVAL);
});

climate.on('error', function(err) {
	console.log('Error connecting to climate module:');
	console.log(err);
});