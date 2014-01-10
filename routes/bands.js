var mongoose = require('mongoose');
var User = mongoose.model('User');
var Band = mongoose.model('Band');

exports.create = function(req,res){
	var band = new Band();
	band.name = req.body.name;
	band.image = req.body.image;
	band.members.push(res.locals.user.id);
	band.save(function(err,band){
		User.findById(res.locals.user.id,function(err,user){
			console.log("Found user: "+ user);
			user.band = band.id;
			console.log("Saved band to user: " + user.band);
			user.save(function(err,user){
					res.redirect('/dashboard');
			});
		});
	});
};


exports.index = function(req,res){
	User.findById(res.locals.user.id, function(err, user){
		Band.findOne({members: user.id}).populate("members").populate("events").exec(function(err,band){
				res.render('bands/index',{title: band.name + "'s Dashboard", band:band});
		});
	});
};


exports.members = function(req,res){
	console.log("Moving to add user page");
	User.find(function(err,users){
		console.log(users);
		res.render('bands/members',{title:'Add Members to your band',users:users});
	});
};

exports.addMembers = function(req,res){
	console.log('Adding members');
	Band.findOne({members:res.locals.user.id},function(err,band){
		for(var i=0; i < req.body.user.length; i++){
			band.members.push(req.body.user[i]);
			User.findById(req.body.user[i],function(err,user){
					user.band = band.id;
					user.save(function(err){console.log('saved user')});
			});
		}
		band.save(function(err,band){
			res.redirect('bands/index',{band:band});
		});
	});
};


exports.getCalendar = function(req,res){
	Band.findOne({members:res.locals.user.id}).populate('events').exec(function(err,band){
		res.render('bands/calendar',{title:"Your Band's Events", band: band});
	});
}