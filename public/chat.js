$(function(){
    // Make connection.
    var socket = io.connect('http://localhost:3000');

    // Buttons and inputs
    var message = $("#message");
    var username = $("#username");
    var send_message = $("#send_message");
    var send_username = $("#send_username");
    var chatroom = $("#chatroom");

    // Listen for connections
    io.on('connection', (socket) => {
        console.log('New user connected.');

        // Default User Name
        socket.username = "Anonymous";

        // Emit message
        send_message.click(function(){
            socket.emit('new_message', {message : message.val()})
        });

        // Listen on new_message
        socket.on("new_message", (data) => {
            console.log(data)
            chatroom.append("<p class='message'>" + data.username + ": " + data.message + "<p>")
        });

        // Emit a username
        send_username.click(function(){
            console.log(username.val())
            socket.emit('change_username', {username : username.val()})
        });

        socket.on('change_username', (data) => {
            console.log(username.val() + "changed...");
            socket.username = data.username;
        });

        // below this point, optional code can be found 
        // Emit typing
        message.bind("keypress", () => {
            socket.emit('typing')
        });

        // Listen on typing
        socket.on('typing', (data) => {
            feedback.html("<p><i>" + data.username + " is typing a message..." + "</p></i>")
        });

        // Listen on typing
        socket.on('typing', (data) => {
            socket.broadcast.emit('typing', {username : socket.username})
        });
        // above this point, optional code can be found ^^

    });

});
