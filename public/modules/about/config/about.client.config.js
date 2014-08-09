'use strict';

// About module config
angular.module('about').run(['Menus',
  function(Menus) {
    // Config logic
    Menus.addMenuItem('topbar', 'About', 'about', 'item', '/about', true);
  }
]);
