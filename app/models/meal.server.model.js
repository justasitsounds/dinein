'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	mealTags = require('./mealTags'),
	_ = require('lodash'),
	Schema = mongoose.Schema;

/**
 * mealTag validator
 */
var mealTagValidator = function(value) {
	var vals = Object.keys(mealTags).map(function(key) {
		return mealTags[key];
	});
	return _.difference(value, vals).length == 0;
};

/**
 * Meal Schema
 */
var MealSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please give your meal a name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	host: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	location: {
		suburb: {
			type: String,
			default: '',
			required: 'location.suburb is required',
			trim: true
		},
		latitude: {
			type: Number
		},
		longitude: {
			type: Number
		}
	},
	description: {
		type: String,
		default: '',
		required: 'Please provide a description for your meal',
		trim: true
	},
	tags: [String],
	startDate: {
		type: Date,
		required: 'Please provide a start date'
	},
	guests: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	seats: {
		type: Number,
		default: 2
	}
});

MealSchema.path('tags').validate(mealTagValidator, 'enum validator failed for path `{PATH}` with value `{VALUE}`');

mongoose.model('Meal', MealSchema);
