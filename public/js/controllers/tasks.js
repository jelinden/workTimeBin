'use strict';

var $jq = jQuery.noConflict();

angular.module('mean.tasks').controller('TasksController', ['$scope', '$route', '$routeParams', '$location', 'Global', 'Tasks',
function ($scope, $route, $routeParams, $location, Global, Tasks) {
    $scope.global = Global;

    $scope.create = function() {
        var task = new Tasks({
            date: new Date(this.date),
            time: this.time
        });
        task.$save(function() {
            $route.reload();
        });
        
        this.date = '';
        this.time = '';
    };
    
    $scope.date = new Date();
    
    $scope.remove = function(task) {
        if (task) {
            task.$remove();

            for (var i in $scope.tasks) {
                if ($scope.tasks[i] === task) {
                    $scope.tasks.splice(i, 1);
                }
            }
        }
        else {
            $scope.task.$remove();
            $location.path('tasks');
        }
    };

    $scope.update = function() {
        var task = $scope.task;
        if (!task.updated) {
            task.updated = [];
        }
        task.updated.push(new Date().getTime());

        task.$update(function() {
            $location.path('tasks/' + task._id);
        });
    };

    $scope.find = function() {
        Tasks.query({
            fromDate: $routeParams.fromDate
        },
        function(tasks) {
            $scope.tasks = tasks;
            setHoursAndMinutes(tasks);
            $jq.datepicker.setDefaults($jq.datepicker.regional.fi);
            if($routeParams.fromDate !== undefined) {
                $scope.weekNumber = $jq.datepicker.iso8601Week($jq.datepicker.parseDate('yy-mm-dd', $routeParams.fromDate));
            } else {
                $scope.weekNumber = $jq.datepicker.iso8601Week(new Date());
            }
            $scope.lastWeekDate = $jq.datepicker.formatDate('yy-mm-dd', getLastWeek($routeParams.fromDate));
            $scope.nextWeekDate = $jq.datepicker.formatDate('yy-mm-dd', getNextWeek($routeParams.fromDate));
        });
        
        function getLastWeek(fromDate) {
            var today = new Date();
            if(fromDate !== undefined) {
                today = $jq.datepicker.parseDate('yy-mm-dd', fromDate);
            }
            var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
            return lastWeek;
        }
        
        function getNextWeek(fromDate) {
            var today = new Date();
            if(fromDate !== undefined) {
                today = $jq.datepicker.parseDate('yy-mm-dd', fromDate);
            }
            var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
            return lastWeek;
        }
        
        function setHoursAndMinutes(tasks) {
            $scope.hours = 0;
            $scope.minutes = 0;
            for(var i in tasks) {
                if(tasks[i].time !== undefined) {
                    var time = tasks[i].time.split(':');
                    $scope.hours += Number(time[0]);
                    $scope.minutes += Number(time[1]);
                }
            }
            if($scope.minutes > 59) {
                $scope.hours += Math.floor($scope.minutes / 60);
                $scope.minutes = $scope.minutes % 60;
            }
            $scope.hours = ($scope.hours).toFixed(0);
        }
    };

    $scope.findOne = function() {
        Tasks.get({
            taskId: $routeParams.taskId
        }, function(task) {
            $scope.task = task;
        });
    };
}]);