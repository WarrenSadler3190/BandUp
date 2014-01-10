var mongoose = require('mongoose');
var User = mongoose.model('User');
var Band = mongoose.model('Band');
var bcrypt = require('bcrypt');

exports.signUp = function(req,res){
	res.render('users/signUp',{title:'Sign Up for Band Up'});
};


exports.create = function(req,res){
	console.log('Making A New User');
	console.log(req.params);
	var user = new User();
	user.name = req.body.name;
	user.image = req.body.image;
	user.email = req.body.email;
	bcrypt.hash(req.body.password, 10, function(err, hash){
		user.password = hash;
		user.save(function(err){
			if(err){
				console.log(err);
			}else{
			res.send({status:'ok'});
		}
		});
	});
};

exports.login = function(req,res){
	console.log('User Navigated To Login Page');
	res.render('users/login',{title:'Login To Band Up'});
};

exports.logout = function(req, res){
  req.session.destroy(function(err){
    res.redirect('/');
  });
};

exports.signIn = function(req,res){
	console.log("Bout to Sign In!");
	User.findOne({email:req.body.email},function(err,user){
		console.log("Found User:" + user);
		bcrypt.compare(req.body.password, user.password,function(err,result){
			if(result){
				console.log("Good Password");
				req.session.regenerate(function(err){
					req.session.userId = user.id;
					req.session.save(function(err){
						console.log(req.session.userId);
						res.send({status:'ok', user:user});
					});
				});
			}else{
				console.log('bad password');
			}
		});
	});
}

exports.dashboard = function(req,res){
	User.findById(res.locals.user,function(err,user){
		Band.find(function(err,bands){
			res.render('users/dashboard',{title:'Welcome ' + user.name, user:user, bands:bands});
		});
	});
}

exports.joinBand = function(req,res){
	Band.findById(req.body.id,function(err,band){
		console.log(band);
		band.members.push(res.locals.user.id);
		band.save(function(err,band){
			User.findById(res.locals.user.id,function(err,user){
				console.log(user);
				user.band = band.id;
					user.save(function(err,user){
						console.log(user);
						res.send({status:'ok'});
					});
				});
			});
		});

}

exports.messages = function(req,res){
	User.find(function(err,users){
		User.findById(res.locals.user.id).populate('messages').exec(function(err,currentUser){
			res.render('users/messages',{title:'Message Page', users:users, currentUser:currentUser});
		});
	});
}