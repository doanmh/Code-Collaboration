var EditorClient = ot.EditorClient;
var SocketIOAdapter = ot.SocketIOAdapter;
var CodeMirrorAdapter = ot.CodeMirrorAdapter;

var socket = io.connect('http://localhost:3000');
var editor = CodeMirror.fromTextArea(document.getElementById("code-screen"), {
    lineNumbers: true,
    theme: "monokai"
});

var code = $("#code-screen").val();

var cmClient;
function init(str, revision, clients, serverAdapter) {
    if (!code) {
        editor.setValue(str);
    }
    cmClient = window.cmClient = new EditorClient(revision, clients, serverAdapter, new CodeMirrorAdapter(editor));
}

socket.on('doc', function (obj) {
    init(obj.str, obj.revision, obj.clients, new SocketIOAdapter(socket));
});

var username = $("#chatbox-username").text().trim();

var roomId = $("#roomId").val();
socket.emit('joinRoom', { room: roomId, username: username });

var userMessage = function (name, text) {
    return ('<li class="media"> <div class="media-body">  <div class="media">' +
        '<div class="media-body">' +
        '<b>' + name + '</b> : ' + text +
        '<hr/> </div></div></div></li>'
    );
};

var sendMessage = function () {
    var userMessage = $('#userMessage').val();
    socket.emit("chatMessage", { message: userMessage, username: username });
    $("#userMessage").val("");
};

socket.on('chatMessage', function (data) {
    $("#chatbox-listMessages").append(userMessage(data.username, data.message));
});

//PEER JS
// Compatibility shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// PeerJS object
var peer = new Peer(username.trim() + roomId, { key: '' });
peer.on('open', function () {
    $('#my-id').text(peer.id);
});
// Receiving a call
peer.on('call', function (call) {
    // Answer the call automatically (instead of prompting user) for demo purposes
    call.answer(window.localStream);
    step3(call);
});
peer.on('error', function (err) {
    alert(err.message);
    // Return to step 2 if error occurs
    step2();
});
// Click handlers setup
$(function () {
    $('#make-call').click(function () {
        // Initiate a call!
        var call = peer.call($('#callto-id').val(), window.localStream);
        step3(call);
    });
    $('#end-call').click(function () {
        window.existingCall.close();
        step2();
    });
    // Get things started
    step1();
});
function step1() {
    // Get audio/video stream
    navigator.getUserMedia({ audio: true, video: true }, function (stream) {
        // Set your video displays
        $('#my-video').prop('src', URL.createObjectURL(stream));
        window.localStream = stream;
        step2();
    }, function () { $('#step1-error').show(); });
}
function step2() {
    $('#step1, #step3').hide();
    $('#step2').show();
}
function step3(call) {
    // Hang up on an existing call if present
    if (window.existingCall) {
        window.existingCall.close();
    }
    // Wait for stream on the call, then set peer video display
    call.on('stream', function (stream) {
        $('#second-video').prop('src', URL.createObjectURL(stream));
    });
    // UI stuff
    window.existingCall = call;
    $('#second-id').text(call.peer);
    call.on('close', step2);
    $('#step1, #step2').hide();
    $('#step3').show();
}