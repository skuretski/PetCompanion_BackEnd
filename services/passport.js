//Strategies (local and jwt) written with help from 
//https://github.com/alex-paterson/todolist-auth-backend-complete/blob/master/services/passport.js

const passport = require('passport');
const getJwt = require('passport-jwt').ExtractJwt;
const JwtStrat = require('passport-jwt').Strategy;
const LocalStrat = require('passport-local');
const User = require('../models/users');
const config = require('../config');

//Local strategy fields
var localOptions = {
	usernameField: 'email'
};

/* Using passport local strategy for user verification. 
   From the request, find a user in the database with that email address.
   If the user exists, verify the password (see models/users.js for function).
   If matches, then the user if verified. 
*/
var localStrategy = new LocalStrat(localOptions, function(email, password, callback){
	User.findOne({email: email}, function(error, user){
		if(error)
			return callback("Cannot find user email.");
		if(!user)
			return callback(null, false);
		user.verifyPassword(password, function(error, match){
			if(error)
				return callback("Cannot verify password");
			if(!match)
				return callback(null, false);
			return callback(null, user);
		});
	});
});

// Configuring jwt options: secret is in config.js and token will be in authorization header
var jwtOptions = {
	secretOrKey: config.secret,
	jwtFromRequest: getJwt.fromHeader('authorization')
};
/* Using passport jwt strategy for authentication.
   Find a user by ID.
   If no user, return false. If user, return user.
   See docs: https://www.npmjs.com/package/passport-jwt
 */
var jwtStrategy = new JwtStrat(jwtOptions, function(payload, callback){ 	//Payload contains the object literal of token
	User.findById(payload.sub, function(error, user){
		if(error)
			return callback(error, false)
		if(user)
			callback(null, user);
		else
			callback(null, false);
	});
});

passport.use(localStrategy);
passport.use(jwtStrategy);