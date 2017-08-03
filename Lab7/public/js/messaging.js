//Make Connection

var socket = io.connect("http://localhost:3000");

//Get input values

var user = document.getElementById("user");
var message = document.getElementById("message");
var query = document.getElementById("query");

submitButton = document.getElementById("submitButton");

// Emit data submission event

submitButton.addEventListener('click', function() {
    socket.emit('submitQuery', {
        user: user.value,
        message: message.value,
        query: query.value
    });
});