var mongoose = require('mongoose');

var Band = mongoose.Schema({
		name			: String,
		image			: String,
		members		: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
		events		: [{type: mongoose.Schema.Types.ObjectId, ref: "Event"}],
		createdAt	: {type:Date, default:Date.now}
});


mongoose.model("Band", Band);

