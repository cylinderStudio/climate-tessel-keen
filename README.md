climate-tessel-keen
===================

NodeJS (Tessel) app that (at timed intervals - I have it set to every 5 minutes in the constants defined up top) will grab local temperature from the microcontroller sensor, pull temperature of provided locale from Weather Underground API, and post data to Keen.io. 

Includes code to prevent wi-fi from choking if Tessel quits in the midst of network operation
http://start.tessel.io/wifi

You will need to include your own credentials (described below) and change the city and state portions of the locale for which you want to get the local weather in line 47 of server.js (where I currently have ```WA/Seattle.json```:

```
request.get('http://api.wunderground.com/api/' + WEATHER_APP_KEY + '/conditions/q/WA/Seattle.json', function(error, response, body) {
```

### Credentials

To keep credentials safe (Keen.io and Weather Underground Keys) they should be kept in a config.js file that is in a git-ignored 'credentials' directory. And load that file with a Node 'require' statement.

server.js:

```
var config = require('./credentials/config.js');
```

/credentials/config.js:

```
// Keen.io and Weather Underground keys
// These, of course, aren't real values for either API. Get your app keys from those services once you set up your accounts.

module.exports.keen = {
	project_id: '123456789abcdefghijk',
	write_key: '123456789abcdefghijk123456789abcdefghijk123456789abcdefghijk123456789abcdefghijk'
};

module.exports.weather = {
	app_key: '123456789abcdefghijk'
};
```
