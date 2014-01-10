var express = require('express');
var mongoose = require('mongoose');

// model definitions
require('require-dir')('./models');

// route definitions
var home = require('./routes/home');
var users = require('./routes/users');
var bands = require('./routes/bands');
var events = require('./routes/events');
var messages = require('./routes/messages');

//middleware
var middleware = require('./lib/middleware');

var app = express();
var RedisStore = require('connect-redis')(express);
mongoose.connect('mongodb://localhost/band-up-final');

// configure express
require('./config').initialize(app, RedisStore);

// routes
app.get('/', home.index);

//user routes
app.get('/signUp', users.signUp);
app.post('/create', users.create);
app.get('/login',users.login);
app.get('/logout',users.logout);
app.put('/signIn', users.signIn);
app.put('/addMemberToBand', users.joinBand);
app.get('/dashboard',users.dashboard);
app.get('/messages',users.messages);

//band routes
app.post('/makeBand', bands.create);
app.get('/bands/:id', bands.index);
app.get('/memberAdd', bands.members);
app.post('/addMembers/', bands.addMembers);
app.get('/calendar', bands.getCalendar);



//event routes
app.get('/getEvents', events.sendToCalendar);
app.get('/calendar/:id', events.show);
app.put('/events/edit', events.edit);

//message routes
app.get('/messages/:id', messages.createMessage);
app.post('/messages/sendMessage', messages.sendMessage);
app.delete('/messages', messages.delete);


// start server & socket.io
var common = require('./sockets/common');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server, {log: true, 'log level': 2});
server.listen(app.get('port'));
io.of('/app').on('connection', common.connection);
