'use strict';

//Setting up route
angular.module('mean').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/tasks', {
            templateUrl: 'views/tasks/list.html'
        }).
        when('/tasks/from/:fromDate', {
            templateUrl: 'views/tasks/list.html'
        }).
        when('/tasks/create', {
            templateUrl: 'views/tasks/create.html'
        }).
        when('/tasks/:taskId/edit', {
            templateUrl: 'views/tasks/edit.html'
        }).
        when('/tasks/:taskId', {
            templateUrl: 'views/tasks/view.html'
        }).
        when('/', {
            templateUrl: 'views/index.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);