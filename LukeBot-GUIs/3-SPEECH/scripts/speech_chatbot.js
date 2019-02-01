// TTS code taken and modified from here:
// http://stephenwalther.com/archive/2015/01/05/using-html5-speech-recognition-and-text-to-speech
//---------------------------------------------------------------------------------------------------


window.speechSynthesis.onvoiceschanged = function() {
    voices = window.speechSynthesis.getVoices()}

function speak(text, callback) {
    var u = new SpeechSynthesisUtterance();
    u.text = text;
    u.lang = 'en-GB';
    // u.lang = 'es-MX';
    u.voice = voices[6]; //English voice
    // u.voice = voices[22] //spanish at 22,7?
    u.rate = .9;
    u.pitch = 1;
    u.volume = .5;

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
//-----End of TTS Code Block-----------------------------------------------------------------------------




function processResponse(response) { // given the final CS text, converts the parsed response from the CS server into HTML code for adding to the response holder div
    var botSaid = '<strong>' + botName + ':</strong> ' + response + "<br>\n";
    update(botSaid);
    speak(response);
}


// Continuous Speech recognition code taken and modified from here:
// https://github.com/GoogleChrome/webplatform-samples/tree/master/webspeechdemo
//----------------------------------------------------------------------------------------------------
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
    info.innerHTML = "This will not work.  You need to use the Chrome browser. ";
} else {
    btnMicrophone.style.display = 'inline-block';
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-MX';
    recognition.lang = 'en-GB';
    recognition.onstart = function() {
        recognizing = true;
        info.innerHTML =  " Speak now.";
        start_img.src = 'assets/mic-animate.gif';
    };
    recognition.onerror = function(event) {
        if (event.error == 'no-speech') {
            start_img.src = 'assets/mic.gif';
            info.innerHTML = "You did not say anything.";
            ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
            start_img.src = 'assets/mic.gif';
            info.innerHTML = "You need a microphone.";
            ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
            if (event.timeStamp - start_timestamp < 100) {
                //Added more detailed message to unblock access to microphone.
                info.innerHTML = " I am blocked. In Chrome go to settings. Click Advanced Settings at the bottom. Under Privacy click the Content Settings button. Under Media click Manage Exceptions Button. Remove this site from the blocked sites list. ";
            } else {
                info.innerHTML = "You did not click the allow button."
            }
            ignore_onend = true;
        }
    };
    recognition.onend = function() {
        recognizing = false;
        if (ignore_onend) {
            return;
        }
        start_img.src = 'assets/mic.gif';
        if (!final_transcript) {
            info.innerHTML = "Click on the microphone icon and begin speaking.";
            return;
        }
        info.innerHTML = "";

    };
    recognition.onresult = function(event) {
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
                //----Added this section to integrate with Chatscript submit functionality-----
                txtMessage.value = final_transcript;
                final_transcript ='';
                final_span.innerHTML = '';
                interim_span.innerHTML = '';
                if (cbAutoSend == 'checked') { $('#frmChat').submit(); }
                //-----------------------------------------------------------------------------
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        final_span.innerHTML = final_transcript;
        interim_span.innerHTML = interim_transcript;
    };
}
function microphoneClick(event) {
    if (recognizing) {
        recognition.stop();
        return;
    }
    final_transcript = '';
    txtMessage.value = '';
    recognition.start();
    ignore_onend = false;
    final_span.innerHTML = '';
    interim_span.innerHTML = '';
    start_img.src = 'assets/mic-slash.gif';
    info.innerHTML = " Click the Allow button above to enable your microphone.";
    start_timestamp = event.timeStamp;
}