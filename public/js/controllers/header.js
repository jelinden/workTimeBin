'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;
    $scope.menu = [ {'title': 'Hours', 'link': 'tasks'} ];
    $scope.isCollapsed = false;
}]);