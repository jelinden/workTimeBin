angular.module('mean.tasks').controller('TasksController', function($scope) {
    $scope.dateOptions = {
        changeYear: false,
        changeMonth: false,
        yearRange: '2012:2100',
        formatDate: 'mm/dd/yyyy'
    };
});