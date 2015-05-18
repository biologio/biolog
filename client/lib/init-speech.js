/**
 * Created by dd on 2/24/15.
 */

// say a message
speak = function(text, callback) {
    var u = new SpeechSynthesisUtterance();
    u.text = text;
    u.lang = 'en-US';

    u.onend = function () {
        if (callback) {
            callback();
        }
    };

    u.onerror = function (e) {
        if (callback) {
            callback(e);
        }
    };

    speechSynthesis.speak(u);
}


// ask a question and get an answer
ask = function(text, callback) {
    // ask question
    speak(text, function () {
        // get answer
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onend = function (e) {
            if (callback) {
                callback('no results');
            }
        };


        recognition.onresult = function (e) {
            // cancel onend handler
            recognition.onend = null;
            if (callback) {
                callback(null, {
                    transcript: e.results[0][0].transcript,
                    confidence: e.results[0][0].confidence
                });
            }
        }

        // start listening
        recognition.start();
    });
}