var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var functions = require('./functions');
//var filename = "";

app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/views'));

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    res.setHeader('Access-Control-Allow-Methods', 'POST', 'GET');

    // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});


//app.use(bodyparser); 
//var jsonParser = bodyparser.json();
//
//var urlParser = bodyparser.urlencoded({
//    extended: true
//});

app.use(bodyparser.json());

// app.use(Cookie());

// app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.sendFile(__dirname + "index.html");
});

app.post('/uploadAudio', functions.uploadAudio);

app.get('/speech_to_text', functions.speech_to_text);

app.get('/downloadSpeech', functions.downloadSpeech);

app.listen(3000);
