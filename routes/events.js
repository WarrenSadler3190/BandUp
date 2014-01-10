var mongoose = require('mongoose');
var Event = mongoose.model('Event');
var Band = mongoose.model('Band');


exports.sendToCalendar = function(req,res){
	Band.findOne({members:res.locals.user.id}).populate('events').exec(function(err,band){
		res.send(band.events);
	});
}

exports.show = function(req,res){
	Event.findById(req.params.id, function(err,event){
		res.render('events/show',{event:event});
	});
}


exports.edit = function(req,res){
	console.log(req.body)
	Event.findByIdAndUpdate(req.body.id,req.body,function(err,event){
		res.send({status:'ok'});
	});
}