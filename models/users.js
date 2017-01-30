var crypt = require('password-hash-and-salt');
var mongoose = require('mongoose');

var userModel = new mongoose.Schema({
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	}
});

userModel.pre('save', function(callback){
	var user = this;
	if(!user.isModified('password')){
		return callback();
	}
	else{
		crypt(user.password).hash(function(error, hash){
			if(error){
				return callback(error);
			}
			user.password = hash;
			callback();
		});
	}
});

userModel.methods.verifyPassword = function(pw, comp){
	crypt(pw).verifyAgainst(this.password, function(error, match){
		if(error){
			return comp(error);
		} 
		comp(null, match);
	});
};

module.exports = mongoose.model('User', userModel);