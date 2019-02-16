// Text To Speech using speechSynthesis from Web Speech Api
//---------------------------------------------------------------------------------------------------

voices = []
window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices()}

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
        console.log(e.error);
        if (callback) {
            callback(e);
        }
    };

    speechSynthesis.speak(u);
}

function processResponse(response) { // given the final CS text, converts the parsed response from the CS server into HTML code for adding to the response holder div
    const botSaid = `<strong>${botName}:</strong> ${response}<br>\n`;
    update(botSaid);
    speak(response);

//-----End of TTS Code Block-----------------------------------------------------------------------------

// Speech recognition code starts here: uses "recognition" from Web Speech API and is linked to button click event

let final_transcript = '';
let recognizing = false;
let ignore_onend;
let start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
    info.innerHTML = "This will not work.  You need to use the Chrome browser. ";
} else {
    btnMicrophone.style.display = 'inline-block';
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = false; //Continuous Speech recognition toggle
    recognition.interimResults = true;
    recognition.lang = 'es-MX';
    recognition.lang = 'en-GB';
    recognition.onstart = () => {
        recognizing = true;
        info.innerHTML =  " Speak now.";
        start_img.src = 'assets/mic-animate.gif';
    };
    recognition.onerror = ({error, timeStamp}) => {
        if (error == 'no-speech') {
            console.log(error)
            start_img.src = 'assets/mic.gif';
            info.innerHTML = "You did not say anything.";
            ignore_onend = true;
        }
        if (error == 'audio-capture') {
            console.log(error)
            start_img.src = 'assets/mic.gif';
            info.innerHTML = "You need a microphone.";
            ignore_onend = true;
        }
        if (error == 'not-allowed') {
            console.log(error)
            if (timeStamp - start_timestamp < 100) {
                //Added more detailed message to unblock access to microphone.
                info.innerHTML = " I am blocked. In Chrome go to settings. Click Advanced Settings at the bottom. Under Privacy click the Content Settings button. Under Media click Manage Exceptions Button. Remove this site from the blocked sites list. ";
            } else {
                info.innerHTML = "You did not click the allow button."
            }
            ignore_onend = true;
        }
    };
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
    recognition.onresult = ({resultIndex, results}) => {
        let interim_transcript = '';
        for (let i = resultIndex; i < results.length; ++i) {
            if (results[i].isFinal) {
                final_transcript += results[i][0].transcript;
                //----Added this section to integrate with Chatscript submit functionality-----
                txtMessage.value = final_transcript;
                final_transcript ='';
                final_span.innerHTML = '';
                interim_span.innerHTML = '';
                if (cbAutoSend == 'checked') { $('#frmChat').submit(); }
                //-----------------------------------------------------------------------------
            } else {
                interim_transcript += results[i][0].transcript;
            }
        }
        final_span.innerHTML = final_transcript;
        interim_span.innerHTML = interim_transcript;
    };
}
function microphoneClick({timeStamp}) {
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
    start_timestamp = timeStamp;
}