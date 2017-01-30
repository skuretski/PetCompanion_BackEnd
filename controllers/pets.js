var Pet = require('../models/pets');
var validate = require('express-validator');

exports.postPets = function(req, res, next) {
	var pet = new Pet();
	if(!req.body.petname){
		res.json({
			error: "You must have a pet name." 
		});
	}
	else{
		if(req.body.petname)
			req.assert('petname', 'A valid name is required. (Letters a-z and A-Z).').isAlpha();
		if(req.body.dob)
			req.assert('dob', 'A valid date is required').isDate();
		if(req.body.gender)
			req.assert('gender', 'Please enter gender as "M" or "F" if appropriate').isIn(req.body.gender, ['M', 'F']);
		if(req.body.spay_neuter)
			req.assert('spay_neuter', 'Spay or neuter must be a Boolean value').isBoolean();
		var errors = req.validationErrors();
		if(!errors){
			pet.petname = req.body.petname;
			pet.dob = req.body.dob;
			pet.type = req.body.type;
			pet.gender = req.body.gender;
			pet.spay_neuter = req.body.neuter;
			pet.owner = req.user._id;
			pet.save(function(error){
				if(error)
					return res.json({
						error: error,
						message: "Error adding new pet."
					});
				res.json({
					message: "Pet added.",
					data: pet
				});
			});
		} else{
			res.json(errors);
		}
	}
};

exports.getPets = function(req, res, next) {
	Pet.find({owner: req.params.user_id}, function(error, pets) {
		if(error)
			return res.json({
				error: error,
				message: "Cannot find any pets."
			});
		res.json(pets);
	});
};

exports.getOnePet = function(req, res, next) {
	Pet.findOne({_id: req.params.id}, function(error, pet){
		if(error)
			return res.json({
				error: error,
				message: "Cannot find pet with that ID"
			});
		res.json(pet);
	});
};

exports.putPet = function(req, res, next) {
	if(req.body === undefined)
		return res.json({
			error: "Cannot update",
			message: "No body parameters."
		});
	// if(req.body.dob){
	// 	req.assert('dob', 'A valid date is required').isDate();
	// }
	if(req.body.petname){
		req.assert('petname', 'A valid name is required. (Letters a-z and A-Z).').isAlpha();
	}
	// if(req.body.gender){
	// 	var values = ['M', 'F', 'm', 'f'];
	// 	req.assert('gender', 'Please enter gender as "M" or "F" if appropriate').isIn(req.body.gender, values);
	// }
	// if(req.body.spay_neuter){
	// 	req.assert('spay_neuter', 'Spay or neuter must be a Boolean value').isBoolean();
	// }
	var errors = req.validationErrors();
	if(!errors){
		Pet.findByIdAndUpdate(req.params.pet_id, {petname: req.body.petname, type: req.body.type}, {new : true}, function(error, updatePet){
			console.log(req.body);
			console.log(req.params);
			if(error)
				return res.json({
					error: error,
					message: "Cannot find and update pet"
				});
			res.json({ 
				message: "Pet updated",
				data: updatePet
			});
		});
	} else {
		res.json(errors);
	}
};

exports.deletePet = function(req, res, next) {
	Pet.findOne({_id: req.params.pet_id}, function(error, pet){
		if(error)
			return res.json({
				message: "Cannot find pet with that ID"
			});
		else{
			Pet.remove({_id: req.params.pet_id }, function(error){
				if(error)
					return res.json({
						error: error,
						message: "Error deleting pet."
					});
				res.json({message: "Pet removed"});
			});
		}
	});
};