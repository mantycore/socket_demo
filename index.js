var express = require('express')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static('public'));

pool = [];
function getFree() {
	var i = pool.indexOf(null);
	return i !== -1 ? i : pool.length;
}

io.on('connection', function (client) {
  var index = getFree();
  pool[index] = client;
  console.log("connect", index);
  client.on('data', function (data) { console.log("data", index, data); });
  client.on('disconnect', function () {
  	console.log("disconnect", index);
    pool[index] = null;
  });
});
server.listen(3000);
