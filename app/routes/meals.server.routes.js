'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var meals = require('../../app/controllers/meals');

	// Meals Routes
	app.route('/meals')
		.get(meals.list)
		.post(users.requiresLogin, meals.create);

	app.route('/meals/:mealId')
		.get(meals.read)
		.put(users.requiresLogin, meals.hasAuthorization, meals.update)
		.delete(users.requiresLogin, meals.hasAuthorization, meals.delete);

	// Finish by binding the Meal middleware
	app.param('mealId', meals.mealByID);
};