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
	return _.difference(value, vals).length === 0;
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
	address: {
		unit: {
			type: String,
			trim: true,
			default: ''
		},
		street: {
			type: String,
			trim: true,
			default: ''
		},
		suburb: {
			type: String,
			trim: true,
			required: 'Please specify a suburb for the meal',
			default: ''
		},
		state: {
			type: String,
			trim: true,
			default: ''
		},
		country: {
			type: String,
			trim: true,
			default: ''
		}
	},
	loc: {
		type: [Number],
		validate: function(v) {
			return true;
		},
		index: {
			type: '2dsphere',
			sparse: true
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

MealSchema.index({
	address: {
		loc: '2dsphere'
	}
});

MealSchema.path('tags').validate(mealTagValidator, 'enum validator failed for path `{PATH}` with value `{VALUE}`');

MealSchema.pre('save', function(next) {
	if (this.isNew && Array.isArray(this.loc) && 0 === this.loc.length) {
		this.loc = undefined;
	}
	next();
});

mongoose.model('Meal', MealSchema);
