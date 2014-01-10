var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var User = mongoose.Schema({
	name			: String,
	image			: {type: String, default: './images/icon.png'},
	email			: {type: String, required: true, unique: true},
	password	: {type: String, required: true, unique: true},
	band			: {type: mongoose.Schema.Types.ObjectId, ref: 'Band'},
	messages	: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
	createdAt	: {type: Date, default: Date.now}
});

mongoose.model("User",User);