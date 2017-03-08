var net = require('net');
var express = require('express')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static('public'));

var pool = [];
function getFree() {
    var i = pool.indexOf(null);
    return i !== -1 ? i : pool.length;
}

io.on('connection', function (client) {
  var index = getFree();
  pool[index] = client;
  console.log("connect", index);
  client.on('data', function (data) {
    console.log("data", index, data);
    if (connection_established) {
        //note: client index is unused, any client sends same two parameters
        puredata.write("x " + data.x + ";");
        puredata.write("y " + data.y + ";");
        console.log("Sent to pd");
    }
  });
  client.on('disconnect', function () {
    console.log("disconnect", index);
    pool[index] = null;
  });
});

var puredata = new net.Socket();
var connection_established = false;
puredata.connect(3001, '127.0.0.1', function() {
    console.log('Connected to pd');
    puredata.write('hello;');
    connection_established = true;
});

puredata.on('data', function(data) {
    console.log('Received: ' + data);
    //client.destroy(); // kill client after server's response
});

puredata.on('close', function() {
    console.log('Connection closed');
    connection_established = false;
    //in real application, we should probably try to reconnect after this
});

server.listen(3000);
