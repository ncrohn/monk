var express = require('express'),
    winston = require('winston'),
    net = require('net'),
    socketIo = require('socket.io'),
    mca = require('mca');

var app = express.createServer(),
    PORT = 7000,
    TCP_PORT = 7001,
    arduinoTcp = null;

app.configure(
  function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
  });

app.configure('development',
  function() {
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

var routes = require('./lib/routes')(app);

//app.get('/', routes.splash);
app.post('/temp', routes.temp);

app.listen(PORT);
var io = socketIo.listen(app);

io.sockets.on('connection',
  function() {
    console.log('client connected');
  });

var tcpServer = net.createServer(function (socket) {
  console.log('tcp server running on port 7001');
});

tcpServer.on('connection',
  function (socket) {
    console.log('num of connections on port 7001: ' + tcpServer.connections);
    arduinoTcp = socket;

    socket.on('data',
      function (mydata) {
        console.log('received on tcp socket:' + mydata);
        io.sockets.emit('data', JSON.parse(mydata));
      });
    });
tcpServer.listen(TCP_PORT);

require('mca')(winston, {
  'port': PORT,
  'tcpPort': TCP_PORT
});