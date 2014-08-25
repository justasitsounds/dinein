'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

/**
 * Globals
 */
var user, user2;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function() {
	before(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			provider: 'local',
			dob: '22/02/1977'
		});
		user2 = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			provider: 'local',
			dob: '22/03/1988'
		});

		done();
	});

	describe('Method Save', function() {
		it('should begin with no users', function(done) {
			User.find({}, function(err, users) {
				users.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function(done) {
			user.save(done);
		});

		it('should fail to save an existing user again', function(done) {
			user.save();
			return user2.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without first name', function(done) {
			user.firstName = '';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

	});

	describe('a User', function() {

		beforeEach(function() {
			user = new User({
				firstName: 'Full',
				lastName: 'Name',
				displayName: 'Full Name',
				email: 'test@test.com',
				username: 'justasitsounds',
				password: 'password',
				provider: 'local',
				dob: '22/02/1977'
			});
			user2 = new User({
				firstName: 'Full',
				lastName: 'Name',
				displayName: 'Full Name',
				email: 'test@test.com',
				username: 'justasitsounds2',
				password: 'password',
				provider: 'local',
				dob: '22/02/1977'
			});
		});

		it('should have an address that comprises a GeoJson Point', function(done) {
			user.address = {
				unit: '139',
				street: 'candy lane',
				suburb: 'waterloo',
				state: 'NSW',
				country: 'Straya'
			};
			user.loc = [151.210606, -33.896673];
			user2.loc = [150, -32];
			user.save();
			return user2.save(function(err) {
				should.not.exist(err);

				User.geoNear([151.212532, -33.891601], {
					maxDistance: 5,
					spherical: true
				}, function(err, results, stats) {
					results[0].obj.username.should.eql('justasitsounds');
					done();
				});


			});
		});

	});

	after(function(done) {
		User.remove().exec();
		done();
	});
});
