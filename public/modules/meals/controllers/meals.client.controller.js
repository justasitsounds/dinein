'use strict';

// Meals controller
angular.module('meals').controller('MealsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Meals',
	function($scope, $stateParams, $location, Authentication, Meals) {
		$scope.authentication = Authentication;

		// Create new Meal
		$scope.create = function() {
			// Create new Meal object
			var meal = new Meals ({
				name: this.name
			});

			// Redirect after save
			meal.$save(function(response) {
				$location.path('meals/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing Meal
		$scope.remove = function( meal ) {
			if ( meal ) { meal.$remove();

				for (var i in $scope.meals ) {
					if ($scope.meals [i] === meal ) {
						$scope.meals.splice(i, 1);
					}
				}
			} else {
				$scope.meal.$remove(function() {
					$location.path('meals');
				});
			}
		};

		// Update existing Meal
		$scope.update = function() {
			var meal = $scope.meal ;

			meal.$update(function() {
				$location.path('meals/' + meal._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Meals
		$scope.find = function() {
			$scope.meals = Meals.query();
		};

		// Find existing Meal
		$scope.findOne = function() {
			$scope.meal = Meals.get({ 
				mealId: $stateParams.mealId
			});
		};
	}
]);
