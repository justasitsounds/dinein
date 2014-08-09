'use strict';

(function() {
	// Meals Controller Spec
	describe('Meals Controller Tests', function() {
		// Initialize global variables
		var MealsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Meals controller.
			MealsController = $controller('MealsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Meal object fetched from XHR', inject(function(Meals) {
			// Create sample Meal using the Meals service
			var sampleMeal = new Meals({
				name: 'New Meal'
			});

			// Create a sample Meals array that includes the new Meal
			var sampleMeals = [sampleMeal];

			// Set GET response
			$httpBackend.expectGET('meals').respond(sampleMeals);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.meals).toEqualData(sampleMeals);
		}));

		it('$scope.findOne() should create an array with one Meal object fetched from XHR using a mealId URL parameter', inject(function(Meals) {
			// Define a sample Meal object
			var sampleMeal = new Meals({
				name: 'New Meal'
			});

			// Set the URL parameter
			$stateParams.mealId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/meals\/([0-9a-fA-F]{24})$/).respond(sampleMeal);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.meal).toEqualData(sampleMeal);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Meals) {
			// Create a sample Meal object
			var sampleMealPostData = new Meals({
				name: 'New Meal'
			});

			// Create a sample Meal response
			var sampleMealResponse = new Meals({
				_id: '525cf20451979dea2c000001',
				name: 'New Meal'
			});

			// Fixture mock form input values
			scope.name = 'New Meal';

			// Set POST response
			$httpBackend.expectPOST('meals', sampleMealPostData).respond(sampleMealResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Meal was created
			expect($location.path()).toBe('/meals/' + sampleMealResponse._id);
		}));

		it('$scope.update() should update a valid Meal', inject(function(Meals) {
			// Define a sample Meal put data
			var sampleMealPutData = new Meals({
				_id: '525cf20451979dea2c000001',
				name: 'New Meal'
			});

			// Mock Meal in scope
			scope.meal = sampleMealPutData;

			// Set PUT response
			$httpBackend.expectPUT(/meals\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/meals/' + sampleMealPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid mealId and remove the Meal from the scope', inject(function(Meals) {
			// Create new Meal object
			var sampleMeal = new Meals({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Meals array and include the Meal
			scope.meals = [sampleMeal];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/meals\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMeal);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.meals.length).toBe(0);
		}));
	});
}());