"use strict";

var express = require('express');
var processor = require('./processor');

var app = express();
const port = 3000;

app.get('/news', function (req, res) {
    processor.getAllFeeds().then(function (result) {
        res.send(result);
    }, function (err) {
        console.log(err);
        res.send(err);
    });
});

app.get('/news/search', function(req, res) {
    var searchParameter = req.query["key"];
    processor.getNews(searchParameter).then(function(result) {
        res.send(result);
    });
  
});

app.get('/news/latestHour', function(req, res) {
    processor.getLatestHourNews().then(function(result) {
        res.send(result);
    });  
});

app.listen(port, () => console.log(`Bonnier API is listening at http://localhost:${port}/`));