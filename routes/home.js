var mongoose = require('mongoose');
var User = mongoose.model('User');


exports.index = function(req, res){
			res.render('home/index', {title: 'Band Up'});
};
