// TTS uses Web Speech API (speechSynthessis) and is linked to the ChatScript bot's response from the server
//---------------------------------------------------------------------------------------------------


window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices()
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


function processResponse(response) { // given the final CS text, converts the parsed response from the CS server into HTML code for adding to the response holder div, then speaks the text.
    const botSaid = `<strong>${botName}:</strong> ${response}<br>\n`;
    update(botSaid);
    speak(response);
}


// Speech recognition uses Web Speech API and is linked to the button on-click event. Continuous recognition can be toggled.
//----------------------------------------------------------------------------------------------------
let final_transcript = '';
let recognizing = false;
let ignore_onend;
let recognition = '';
if (!('webkitSpeechRecognition' in window)) {
    info.innerHTML = "This will not work.  You need to use the Chrome browser. ";
} else {
    btnMicrophone.style.display = 'inline-block';
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false; //Continuous recognition toggle
    recognition.interimResults = true; //Used to show partial transcript as recognition tries to arrive at final meaning
    recognition.lang = 'es-MX';
    recognition.lang = 'en-GB';
    recognition.onstart = () => {
        recognizing = true;
        info.innerHTML = " Speak now.";
        start_img.src = 'assets/mic-animate.gif';
    };
    recognition.onerror = ({error}) => {
        if (error === 'no-speech') {
            start_img.src = 'assets/mic.gif';
            info.innerHTML = "You did not say anything.";
            ignore_onend = true;
        }
        if (error === 'audio-capture') {
            start_img.src = 'assets/mic.gif';
            info.innerHTML = "You need a microphone.";
            ignore_onend = true;
        }
        if (error === 'not-allowed') {
            info.innerHTML = "You did not click the allow button."
        }
        ignore_onend = true;
    }
}
recognition.onend = () => {
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

//Turns final recognition transcript into txtMessage and submits to bot via checked input on index.php
recognition.onresult = ({resultIndex, results}) => {
    let interim_transcript = '';
    for (let i = resultIndex; i < results.length; ++i) {
        if (results[i].isFinal) {
            final_transcript += results[i][0].transcript;
            txtMessage.value = final_transcript;
            final_transcript = '';
            final_span.innerHTML = '';
            interim_span.innerHTML = '';
            if (cbAutoSend === 'checked') {
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
    info.innerHTML = " Click the Allow button above to enable your microphone.";
}