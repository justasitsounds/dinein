'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	mealTags = require('../models/mealTags'),
	Meal = mongoose.model('Meal');

/**
 * Globals
 */
var user, meal, guest;

/**
 * Unit tests
 */
describe('Meal Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			provider: 'local',
			dob: '01/01/1932',
			location: 'nowhere'
		});

		guest = new User({
			firstName: 'guest',
			lastName: 'user',
			displayName: ' guest user',
			email: 'guest@user.com',
			username: 'username2',
			password: 'password',
			provider: 'local',
			dob: '01/01/1938',
			location: 'nowheresVille'
		});
		guest.save(function(err) {
			user.save(function(err) {
				meal = new Meal({
					name: 'Meal Name',
					location: {
						suburb: 'Waterloo'
					},
					host: user,
					description: 'description',
					startDate: new Date
				});
				meal.guests.push(guest);
				meal.save(function() {
					done();
				});
			});
		});


	});

	context('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return meal.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) {
			meal.name = '';

			return meal.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when trying to save without location.suburb', function(done) {
			meal.location.suburb = '';

			return meal.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should throw an error when trying to save without a description', function(done) {
			meal.description = '';

			return meal.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should have a collection of one or more meal type Tags', function(done) {
			meal.tags.push(mealTags.VEGAN);
			meal.tags.push(mealTags.GLUTEN_FREE);

			return meal.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should have meal type tags that are only members of the mealTags enum', function(done) {
			meal.tags.push('smelly food');

			return meal.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should allow for there to be 0 or more guests per meal', function(done) {
			var newGuest = new User({
				firstName: 'guest2',
				lastName: 'user2',
				displayName: ' guest user2',
				email: 'guest2@user2.com',
				username: 'username2',
				password: 'password2'
			});
			meal.guests.push(newGuest);

			return meal.save(function(err) {
				should.not.exist(err);
				done();
			});


		});

		it('should retrieve just fine', function(done) {

			var query = Meal.findOne({
				name: 'Meal Name'
			}).select('name guests').populate('guests');
			return query.exec(function(err, meal) {
				should.not.exist(err);
				should.exist(meal);
				meal.guests[0].firstName.should.eql('guest');
				done();
			});
		});

	});

	afterEach(function(done) {
		Meal.remove().exec();
		User.remove().exec();

		done();
	});
});
