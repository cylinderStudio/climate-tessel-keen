climate-tessel-keen
===================

NodeJS (Tessel) app that (at timed intervals) will grab local temperature from the microcontroller sensor, pull temperature of provided locale from Weather Underground API, and post data to Keen.io

Includes code to prevent wi-fi from choking if Tessel quits in the midst of network operation
http://start.tessel.io/wifi

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
