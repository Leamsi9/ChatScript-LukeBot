

const botName = 'Luke';    // change this to your bot name
// declare timer variables
let alarm = null;
let callback = null;
let loopback = null;
let CSoutput = '';
$(() => {
    $('#frmChat').submit(function(e){
        // this function overrides the form's submit() method, allowing us to use AJAX calls to communicate with the ChatScript server
        e.preventDefault();  // Prevent the default submit() method
        const name = $('#txtUser').val();
        if (name == "") {
            alert('Please provide your name.');
            document.getElementById('txtUser').focus();
        }
        const youSaid = `<strong style="color: darkgoldenrod">${name}: ${$('#txtMessage').val()}</strong> <br>\n`;
        update(youSaid);
        const data = $(this).serialize();
        sendMessage(data);
        $('#txtMessage').val('').focus();
    });
    // any user typing cancels loopback or callback for this round
    $('#txtMessage').keypress(() => {
        window.clearInterval(loopback);
        window.clearTimeout(callback);
    });

});
function sendMessage(data){ //Sends inputs to the ChatScript server, and returns the response-  data - a JSON string of input information
    $.ajax({
        url: 'ui.php',
        dataType: 'text',
        data,
        type: 'post',
        success(response) {
            processResponse(parseCommands(response));
        },
        error({responseText}, status, error) {
            alert(`oops? Status = ${status}, error message = ${error}\nResponse = ${responseText}`);
        }
    });
}
function parseCommands(response){ // Response is data from CS server. This processes OOB commands sent from the CS server returning the remaining response w/o oob commands
    CSoutput = response.replace(/\((.*?)\)/, "HELLO")
    const len  = CSoutput.length;
    let i = -1;
    while (++i < len )
    {
        if (CSoutput.charAt(i) == ' ' || CSoutput.charAt(i) == '\t') continue; // starting whitespace
        if (CSoutput.charAt(i) == '[') break; // we have an oob starter
        return CSoutput;            // there is no oob data
    }
    if ( i == len) return CSoutput; // no starter found
    const user = $('#txtUser').val();

    // walk string to find oob data and when ended return rest of string
    let start = 0;
    while (++i < len )
    {
        if (CSoutput.charAt(i) == ' ' || CSoutput.charAt(i) == ']') // separation
        {
            if (start != 0) // new oob chunk
            {
                const blob = CSoutput.slice(start,i);
                start = 0;
                const commandArr = blob.split('=');
                if (commandArr.length == 1) continue; // failed to split left=right
                const command = commandArr[0]; // left side is command
                let interval = (commandArr.length > 1) ? commandArr[1].trim() : -1; // right side is millisecond count
                if (interval == 0)  /* abort timeout item */
                {
                    switch (command){
                        case 'alarm':
                            window.clearTimeout(alarm);
                            alarm = null;
                            break;
                        case 'callback':
                            window.clearTimeout(callback);
                            callback = null;
                            break;
                        case 'loopback':
                            window.clearInterval(loopback);
                            loopback = null;
                            break;
                    }
                }
                else if (interval == -1) interval = -1; // do nothing
                else
                {
                    const timeoutmsg = {user, send: true, message: `[${command} ]`}; // send naked command if timer goes off
                    switch (command) {
                        case 'alarm':
                            alarm = setTimeout(() => {sendMessage(timeoutmsg );}, interval);
                            break;
                        case 'callback':
                            callback = setTimeout(() => {sendMessage(timeoutmsg );}, interval);
                            break;
                        case 'loopback':
                            loopback = setInterval(() => {sendMessage(timeoutmsg );}, interval);
                            break;
                    }
                }
            } // end new oob chunk
            if (CSoutput.charAt(i) == ']') return CSoutput.slice(i + 2); // return rest of string, skipping over space after ]
        } // end if
        else if (start == 0) start = i; // begin new text blob
    } // end while
    return CSoutput;  // should never get here
}

function update(text){ // text is  HTML code to append to the 'chat log' div. This appends the input text to the response div)
    const chatLog = $('#responseContent').html();
    $('#responseContent').html(`${chatLog}<br>${text}`);
}