var bodyparser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var sdk = require("microsoft-cognitiveservices-speech-sdk");
var upload_module = require('./upload');

exports.uploadAudio = function(req, res) {
    // console.log(user);
    var upload = upload_module.uploadArticle('articles[]', 'uploads/');
    upload(req, res, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.redirect("http://localhost:3000/speech_to_text?filename=" + upload_module.name());
            
        }
    });
};

exports.speech_to_text = function(req, res) {
	var subscriptionKey = "a8b7613bffb24b13805dbde793c1c7c3";
	var serviceRegion = "westus"; // e.g., "westus"
	var file = req.query.filename; // 16000 Hz, Mono
	var filename = "./uploads/" + file;
	console.log(file);
	// create the push stream we need for the speech sdk.
	var pushStream = sdk.AudioInputStream.createPushStream();

	// open the file and push it to the push stream.
	fs.createReadStream(filename).on('data', function(arrayBuffer) {
	  pushStream.write(arrayBuffer.buffer);
	}).on('end', function() {
	  pushStream.close();
	});

	// we are done with the setup
	console.log("Now recognizing from: " + filename);

	// now create the audio-config pointing to our stream and
	// the speech config specifying the language.
	var audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
	var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

	// setting the recognition language to English.
	speechConfig.speechRecognitionLanguage = "en-US";

	// create the speech recognizer.
	var recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

	// start the recognizer and wait for a result.
	recognizer.recognizeOnceAsync(
	  function (result) {
	  	// console.log(result.privText);
	  	fs.writeFile('./uploads/Speech.txt',result.privText,function(err) {
	  		if(err) {
	  			recognizer.close();
	    		recognizer = undefined;
	  		} else {
	  			recognizer.close();
	    		recognizer = undefined;
	  			res.redirect("http://localhost:3000/downloadSpeech?orgfile=" + file + "&confile=Speech.txt");
	  		}
	  	});
	  },
	  function (err) {
	    console.trace("err - " + err);

	    recognizer.close();
	    recognizer = undefined;
	    fs.unlink('uploads/' + file, function (err) {
            if (err) throw err;
            data = {
            };
            res.send("Error Occurred");
        });
	  });
}

exports.downloadSpeech = function(req, res) {
	var orgfile = req.query.orgfile;
	var confile = req.query.confile;

	res.download("./uploads/" + confile, function(err) {
		fs.unlink('uploads/' + orgfile, function (err) {
		    if (err) {
		    	throw err;	
		    } else {
		    	fs.unlink('uploads/' + confile, function (err) {
				    if (err) {
				    	throw err;	
				    } else {
				    	// res.redirect("http://localhost:3000/");
				    }
				    
				});
		    }
		    
		});
	});
	
}