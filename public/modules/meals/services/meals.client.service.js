'use strict';

//Meals service used to communicate Meals REST endpoints
angular.module('meals').factory('Meals', ['$resource',
	function($resource) {
		return $resource('meals/:mealId', { mealId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);