const passport = require('passport');
const authControl = require('../controllers/auth');
const passportServ = require('./passport');
const petControl = require('../controllers/pets');

//See services/passport.js for authentication details
var requireAuth = passport.authenticate('jwt', {session: false});
var requireLogin = passport.authenticate('local', {session: false});

var router = require('express').Router();

router.route('/signup')
	.post(authControl.signUp);
router.route('/signin')
	.post([requireLogin, authControl.signIn]);

router.route('/users/:user_id/pets')
	.get(requireAuth, petControl.getPets)
	.post(requireAuth, petControl.postPets);

router.route('/users/:user_id/pets/:pet_id')
	.delete(requireAuth, petControl.deletePet)
	.put(requireAuth, petControl.putPet);

module.exports = router;