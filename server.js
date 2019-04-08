var express = require('express');
var app = express();
var bodyparser = require('body-parser');


var functions = require('./functions');
//var filename = "";

app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(bodyparser.json());

app.use(express.static(__dirname + '/views'));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    // res.sendFile(__dirname + "/index.html");
	res.render("index", {
        
    });
});

app.post('/uploadAudio', functions.uploadAudio);

app.get('/speech_to_text', functions.speech_to_text);

app.get('/downloadSpeech', functions.downloadSpeech);

app.listen(process.env.PORT || 3000);
