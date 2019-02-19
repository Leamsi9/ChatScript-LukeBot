// TTS code taken and modified from here:
// http://stephenwalther.com/archive/2015/01/05/using-html5-speech-recognition-and-text-to-speech
//---------------------------------------------------------------------------------------------------


window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
};

function speak(text, callback) {
    const u = new SpeechSynthesisUtterance();
    u.text = text;
    u.lang = 'en-GB';
    // u.lang = 'es-MX';
    u.voice = voices[6]; //English voice
    // u.voice = voices[22] //spanish at 22,7?
    u.rate = .9;
    u.pitch = 1;
    u.volume = .5;

    u.onend = () => {
        if (callback) {
            callback();
        }
    };

    u.onerror = e => {
        if (callback) {
            callback(e);
        }
    };

    speechSynthesis.speak(u);
}

//-----End of TTS Code Block-----------------------------------------------------------------------------


function processResponse(response) { // given the final CS text, converts the parsed response from the CS server into HTML code for adding to the response holder div
    const botSaid = `<strong>${botName}:</strong> ${response}<br>\n`;
    update(botSaid);
    speak(response);
}


// Continuous Speech recognition code taken and modified from here:
// https://github.com/GoogleChrome/webplatform-samples/tree/master/webspeechdemo
//----------------------------------------------------------------------------------------------------
let final_transcript = '';
let recognizing = false;
let ignore_onend;
let recognition ='';
if (!('webkitSpeechRecognition' in window)) {
    console.log( "This will not work.  You need to use the Chrome browser. ");
} else {
    btnMicrophone.style.display = 'inline-block';
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'es-MX';
    recognition.lang = 'en-GB';
    recognition.onstart = () => {
        recognizing = true;
        console.log( " Speak now.")
        start_img.src = 'assets/mic-animate.gif';
    };
    recognition.onerror = ({error}) => {
        if (error == 'no-speech') {
            start_img.src = 'assets/mic.gif';
            console.log( "You did not say anything.")
            ignore_onend = true;
        }
        if (error == 'audio-capture') {
            start_img.src = 'assets/mic.gif';
            console.log( "You need a microphone.")
            ignore_onend = true;
        }
        if (error == 'not-allowed') {
            console.log( "You did not click the allow button.")
        }
        ignore_onend = true;
    }
}
;
recognition.onend = () => {
    recognizing = false;
    if (ignore_onend) {
        return;
    }
    start_img.src = 'assets/mic.gif';
    if (!final_transcript) {
        console.log( "Click on the microphone icon and begin speaking.")
        return;
    }
};

recognition.onresult = ({resultIndex, results}) => {
    let interim_transcript = '';
    for (let i = resultIndex; i < results.length; ++i) {
        if (results[i].isFinal) {
            final_transcript += results[i][0].transcript;
            txtMessage.value = final_transcript;
            final_transcript = '';
            final_span.innerHTML = '';
            interim_span.innerHTML = '';
            if (cbAutoSend == 'checked') {
                $('#frmChat').submit();
            }
            //-----------------------------------------------------------------------------
        } else {
            interim_transcript += event.results[i][0].transcript;
        }
    }
    final_span.innerHTML = final_transcript;
    interim_span.innerHTML = interim_transcript;
};

function microphoneClick(event) {
    if (recognizing) {
        recognition.stop();
        return;
    }
    final_transcript = '';
    recognition.start();
    ignore_onend = false;
    final_span.innerHTML = '';
    interim_span.innerHTML = '';
    start_img.src = 'assets/mic-slash.gif';
    console.log( " Click the Allow button above to enable your microphone.");
}