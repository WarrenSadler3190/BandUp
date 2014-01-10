var mongoose = require('mongoose');

var Event = mongoose.Schema({
		title				: {type: String, required: true},
		start				: {type: Date, default: Date.now, required: true},
		color				: {type: String, default: "teal"},
		end					: {type: Date, default: Date.now, required: true},
		createdAt		: {type: Date, default:Date.now}
});

mongoose.model("Event",Event);