<!DOCTYPE HTML>
<html lang="en-GB">
<head>
    <title>
        Luke Skywalker Bot
    </title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <link rel="stylesheet" type="text/css" href="stylesheets/stylesheet.css">
    <script defer type="text/javascript" src="js/jquery.min.js"></script>
    <script defer type="text/javascript" src="js/text_chatbot.js"></script>
    <script defer type="text/javascript" src="js/speech_chatbot.js"></script>
    <script type="text/javascript">
        let cbAutoSend = 'checked';
    </script>
</head>
<body>
<section class="container">

    <div id="speechcontainer">
        <div id="info">Click on the microphone to chat with voice</div>
        <div id="button_panel">
            <button id="btnMicrophone" type="button" value="microphone" onclick="microphoneClick()">
                <img id="start_img" src="assets/mic.gif" alt="Start"></button>
        </div>
        <div id="results">
            <span id="final_span" class="final"></span>
            <span id="interim_span" class="interim"></span>
            <p>
        </div>
    </div>
    <form id="frmChat" action="#">
        <input type="hidden" name="message" id="txtMessage" size="80"/>
        <input type="hidden" name="send" value="Send Value"/>
    </form>
    <div class="autosend">
        <input type="checkbox" name="autosend" value="checked" checked
               onclick="if (this.checked) {cbAutoSend = this.value} else { cbAutoSend = '' }"/>
    </div>
</section>
</body>
</html>

    

