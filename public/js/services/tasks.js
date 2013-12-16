//Articles service used for articles REST endpoint
angular.module('mean.tasks').factory("Tasks", ['$resource', function($resource) {
    return $resource('tasks/:taskId', {
        taskId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});