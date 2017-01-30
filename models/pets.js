var mongoose = require('mongoose');

var petModel = new mongoose.Schema({
	petname: {
		type: String,
		required: true
	},
	dob: {
		type: Date
	},
	type: {
		type: String
	},
	gender: {
		type: String
	},
	spay_neuter: { 
		type: Boolean,
	},
	owner: [{
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User'
	}]
});

module.exports = mongoose.model('Pet', petModel);