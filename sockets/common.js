var mongoose = require('mongoose');
var Band = mongoose.model('Band');
var Event = mongoose.model('Event');
var User = mongoose.model('User');
var __ = require('lodash');
var bcrypt = require('bcrypt');
var io;

exports.connection = function(socket){
	io = this;
	console.log(io.sockets);
	socket.emit('connected', {status: 'connected'});
  socket.on('disconnect', socketDisconnect);
  socket.on('addEvent', sockectAddEvent);
  socket.on('signIn', socketSignIn);
  socket.on('deleteEvent',socketDeleteEvent);

  // CHAT EVENT 

  socket.on('sendChatMessage', function (data){
  	console.log(data.message, data.username);
  	var message = data.message;
  	var username = data.username;
  	socket.emit('gotMessage', {username:username, message:message});
  });

	// SOCKET SAVE EVENT

  function sockectAddEvent(data){
	var newEvent = data.data;
	console.log(newEvent);
	var event = new Event();
	event.title = newEvent.title;
	event.color = newEvent.color;
	event.start = newEvent.start;
	event.end = newEvent.end;
	event.save(function(err,event){
		console.log(event);
	User.findOne({name:newEvent.user},function(err,user){
		console.log('Current User: ' + user);
		Band.findOne({members:user.id},function(err,band){
			band.events.push(event.id);
			band.save(function(err,band){});
			console.log(band);
			socket.emit('eventSaved',{data:event});
			});
		});
	});
	}


	// SOCKET DELETE EVENT

	function socketDeleteEvent(data){
		Event.findByIdAndRemove(data.eventId,function(err,deletedEvent){
			Band.findOne({events:deletedEvent._id}, function(err,band){
				__.remove(band.events, function(ev) {return ev == data.eventId});
				band.save(function(err){
					socket.emit('deletedEvent',{status:"ok"});
				});
			});
		});
	}



};

function socketSignIn(data){
	var login = data.data;
	console.log(login.email);
	console.log(login.password);

	User.findOne({email:login.email},function(err,user){
		console.log(user);
		bcrypt.compare(login.password, user.password, function(err,result){
			if(result){
				console.log(req.session);
				console.log('Good password');
			}else{
				console.log('not so good..');
			}
		});
	});

}

// io.sockets.on('connection',function(socket){
// 	socket.emit('news', {
// 		hello: 'world'
// 	});
// 	socket.on('my other event',function(data){
// 		console.log(data);
// 	});
// });


function socketDisconnect(){
}
