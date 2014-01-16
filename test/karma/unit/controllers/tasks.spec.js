'use strict';

(function() {
    
    // Articles Controller Spec
    describe('MEAN controllers', function() {

        describe('TasksController', function() {

            // The $resource service augments the response object with methods for updating and deleting the resource.
            // If we were to use the standard toEqual matcher, our tests would fail because 
            // the test values would not match
            // the responses exactly. To solve the problem, we use a newly-defined toEqualData Jasmine matcher.
            // When the toEqualData matcher compares two objects, it takes only object properties into
            // account and ignores methods.
            beforeEach(function() {
                this.addMatchers({
                    toEqualData: function(expected) {
                        return angular.equals(this.actual, expected);
                    }
                });
            });

            // Load the controllers module
            beforeEach(module('mean'));

            // Initialize the controller and a mock scope
            var TasksController,
                scope,
                $httpBackend,
                $routeParams,
                $location;

            // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
            // This allows us to inject a service but then attach it to a variable
            // with the same name as the service.
            beforeEach(inject(function($controller, $rootScope, _$location_, _$routeParams_,  _$httpBackend_) {

                scope = $rootScope.$new();

                TasksController = $controller('TasksController', {
                    $scope: scope
                });

                $routeParams = _$routeParams_;

                $httpBackend = _$httpBackend_;

                $location = _$location_;

            }));

            it('$scope.find() should create an array with at least one task object ' +
                'fetched from XHR', function() {
                    var date = new Date();
                    // test expected GET request
                    $httpBackend.expectGET('tasks?').respond([{
                        date: date,
                        time: '02:10'
                    }]);
                    $httpBackend.expectGET(/views\/index.html$/).respond(204);

                    // run controller
                    scope.find();
                    $httpBackend.flush();

                    // test scope value
                    expect(scope.tasks).toEqualData([{
                        date: date,
                        time: '02:10'
                    }]);

                });

            it('$scope.findOne() should create an array with one task object fetched ' +
                'from XHR using a taskId URL parameter', function() {
                    // fixture URL parament
                    $routeParams.taskId = '525a8422f6d0f87f0e407a33';
                    var date = new Date();
                    // fixture response object
                    var testTaskData = function() {
                        return {
                            date: date,
                            time: '02:10'
                        };
                    };

                    // test expected GET request with response object
                    $httpBackend.expectGET(/tasks\/([0-9a-fA-F]{24})$/).respond(testTaskData());
                    $httpBackend.expectGET(/views\/index.html$/).respond(204);
                    
                    // run controller
                    scope.findOne();
                    $httpBackend.flush();

                    // test scope value
                    expect(scope.task).toEqualData(testTaskData());

                });

            it('$scope.create() with valid form data should send a POST request ' +
                'with the form input values and then ' +
                'locate to new object URL', function() {
                    var date = new Date();
                    // fixture expected POST data
                    /*var postTaskData = function() {
                        return {
                            date: date,
                            time: '02:10'
                        };
                    };*/

                    // fixture expected response data
                    var responseTaskData = function() {
                        return {
                            _id: '525cf20451979dea2c000001',
                            date: date,
                            time: '02:10'
                        };
                    };

                    // fixture mock form input values
                    scope.date = date;
                    scope.time = '02:10';

                    // test post request is sent
                    //TODO: postTaskData
                    $httpBackend.expectPOST('tasks'/*,postTaskData()*/).respond(responseTaskData());
                    $httpBackend.expectGET(/views\/index.html$/).respond(204);
                    // Run controller
                    scope.create();
                    $httpBackend.flush();

                    // test form input(s) are reset
                    expect(scope.date).toEqual('');
                    expect(scope.time).toEqual('');

                    // test URL location to new object
                    expect($location.path()).toBe('/');
                });

            it('$scope.update() should update a valid task', inject(function(Tasks) {
                var date = new Date();
                // fixture rideshare
                var putTaskData = function() {
                    return {
                        _id: '525a8422f6d0f87f0e407a33',
                        date: date,
                        time: '02:10'
                    };
                };

                // mock article object from form
                var task = new Tasks(putTaskData());

                // mock article in scope
                scope.task = task;

                // test PUT happens correctly
                $httpBackend.expectPUT(/tasks\/([0-9a-fA-F]{24})$/).respond();
                $httpBackend.expectGET(/views\/index.html$/).respond(204);
                $httpBackend.expectGET(/views\/tasks\/view.html$/).respond(204);

                // run controller
                scope.update();
                $httpBackend.flush();

                // test URL location to new object
                expect($location.path()).toBe('/tasks/' + putTaskData()._id);

            }));

            it('$scope.remove() should send a DELETE request with a valid taskId ' +
                'and remove the task from the scope', inject(function(Tasks) {

                    // fixture rideshare
                    var task = new Tasks({
                        _id: '525a8422f6d0f87f0e407a33'
                    });

                    // mock rideshares in scope
                    scope.tasks = [];
                    scope.tasks.push(task);

                    // test expected rideshare DELETE request
                    $httpBackend.expectDELETE(/tasks\/([0-9a-fA-F]{24})$/).respond(204);
                    $httpBackend.expectGET(/views\/index.html$/).respond(204);
                    
                    // run controller
                    scope.remove(task);
                    $httpBackend.flush();

                    // test after successful delete URL location tasks list
                    expect(scope.tasks.length).toBe(0);

                }));

        });

    });
}());