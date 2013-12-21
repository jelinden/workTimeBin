//Tasks service used for task REST endpoint
angular.module('mean.tasks').factory("Tasks", ['$resource', function($resource) {
    return $resource('tasks/:taskId', {
        taskId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
var underscore = angular.module('mean.underscore', []);
    underscore.factory('_', function() {
    return window._; // assumes underscore has already been loaded on the page
});