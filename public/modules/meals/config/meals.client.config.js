'use strict';

// Configuring the Articles module
angular.module('meals').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Meals', 'meals', 'dropdown', '/meals(/create)?');
		Menus.addSubMenuItem('topbar', 'meals', 'List Meals', 'meals');
		Menus.addSubMenuItem('topbar', 'meals', 'New Meal', 'meals/create');
	}
]);