// This API code written with influence from
// https://github.com/alex-paterson/todolist-auth-backend-complete/blob/master/controllers/authentication_controller.js


const User = require('../models/users');
const jwt = require('jwt-simple');			//For the JSON web token
const config = require('../config');

// Creates JWT token based on userID, timestamp, and secret for user

function createToken(user){
	var timestamp = new Date().getTime();	//Getting current time
	return jwt.encode({						//Returning JWT token comprised of userID, timestamp, and secret
		sub: user.id,		
		iat: timestamp
	}, config.secret);
}

/* After successful user verification (see services/passport.js), a user
   gets a JWT token
*/
exports.signIn = function(req, res, next){	
	var user = req.user;
	res.send({token: createToken(user), user_id: user._id});
}

/* Signup function will take the request, see if there are fields for email and password,
   and checks if the user exists already.
   If no user exists, then a new user is created with email and password.
   Upon no errors from the database and new user creation, a JWT token is created.
*/
exports.signUp = function(req, res, next){	
	var email = req.body.email;
	var password = req.body.password;
	if(!email || !password){
		return res.status(422).json({
			error: "You must provide an email and password." 
		});
	}
	User.findOne({email: email}, function(error, userExists){
		if(error){
			return next(error);
		}
		if(userExists){
			return res.status(422).json({
				error: "Email is already taken."
			});
		}
		var user = new User({
			email: email,
			password: password
		});
		user.save(function(error){
			if(error){
				return next(error);
			} else{
				res.json({user_id: user._id, token: createToken(user)});
			}
		});
	});
}
