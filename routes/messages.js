var mongoose = require('mongoose');
var Message = mongoose.model('Message');
var User	= mongoose.model('User');
var __ = require('lodash');

exports.createMessage = function(req,res){
	User.findById(req.params.id, function(err,recipient){
		res.render('messages/create',{title:'Send Message to '+ recipient.name + '.', recipient:recipient})
	});
}

exports.sendMessage = function(req,res){
	var message = new Message();
	message.title = req.body.title;
	message.body = req.body.body;
	User.findById(res.locals.user.id,function(err,sender){
		message.from = sender.name;
		message.save(function(err,message){
			User.findById(req.body.id,function(err,user){
				user.messages.push(message.id);
				user.save(function(err,user){
					res.send({status:'ok'});
				});
			});
		});
	});
}

exports.delete = function(req,res){
	console.log(req.body.id);
	Message.findByIdAndRemove(req.body.id,function(err,deletedMessage){
		User.findById(res.locals.user.id,function(err,user){
		__.remove(user.messages, function(ms) {return ms == req.body.id});
			user.save(function(err,user){
				res.send({status:'ok'});
			});
		});
	});
}