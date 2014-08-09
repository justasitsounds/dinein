'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Meal = mongoose.model('Meal'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Meal already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a Meal
 */
exports.create = function(req, res) {
	var meal = new Meal(req.body);
	meal.user = req.user;

	meal.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(meal);
		}
	});
};

/**
 * Show the current Meal
 */
exports.read = function(req, res) {
	res.jsonp(req.meal);
};

/**
 * Update a Meal
 */
exports.update = function(req, res) {
	var meal = req.meal ;

	meal = _.extend(meal , req.body);

	meal.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(meal);
		}
	});
};

/**
 * Delete an Meal
 */
exports.delete = function(req, res) {
	var meal = req.meal ;

	meal.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(meal);
		}
	});
};

/**
 * List of Meals
 */
exports.list = function(req, res) { Meal.find().sort('-created').populate('user', 'displayName').exec(function(err, meals) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(meals);
		}
	});
};

/**
 * Meal middleware
 */
exports.mealByID = function(req, res, next, id) { Meal.findById(id).populate('user', 'displayName').exec(function(err, meal) {
		if (err) return next(err);
		if (! meal) return next(new Error('Failed to load Meal ' + id));
		req.meal = meal ;
		next();
	});
};

/**
 * Meal authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.meal.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};