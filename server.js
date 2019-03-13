var express = require('express'),
    http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log("Sever is listening....");

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/chat.html");
});

io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('Connection: %S sockets connected', connections.length);

    //this will disconnect the connection
    socket.on('disconnect', function(data){
        if(!socket.username) return;
        users.splice(users.indexOf(socket.username), 1);
        updateusernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %S sockets connected', connections.length);
        //to run the app type "node server" inside the console then press enter
    });
    //send message
    socket.on('send message', function(data){
        io.sockets.emit('new message', {msg: data, user: socket.username});
    });
    //new user
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateusernames();
    });
    function updateusernames(){
        io.sockets.emit('get users', users);
    }
});