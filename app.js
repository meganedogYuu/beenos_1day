
var express = require('express');
var request = require("request");
var app = express();

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});


app.get('/weather/tokyo', function (req, res) {
  request('http://weather.livedoor.com/forecast/webservice/json/v1?city=130010', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.header("Content-Type", "application/json; charset=utf-8");
      res.send(body);
    }
  })
});

app.get('/photos/search', function (req, res) {
  var options = {
    url: 'https://api.flickr.com/services/rest/',
    qs: {
      method: 'flickr.photos.search',
      api_key: process.env.FLICKR_API_KEY,
      format: 'json',
      nojsoncallback: 1,
      text: req.query.text
    },
    method: 'GET',
    json: true
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.header("Content-Type", "application/json; charset=utf-8");
      res.send(body);
    }
  })
});


app.use(express.static('public'));
