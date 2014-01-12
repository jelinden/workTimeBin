/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Task = mongoose.model('Task');

//Globals
var user;
var date;

//The tests
describe('<Unit Test>', function() {
    describe('Model Task:', function() {
        beforeEach(function(done) {
            user = new User({
                name: 'Full name',
                email: 'test@test.com',
                password: 'password'
            });

            user.save(function(err) {
                task = new Task({
                    date: new Date(),
                    time: '02:10',
                    user: user
                });

                done();
            });
        });

        describe('Method Save', function() {
            it('should be able to save without problems', function(done) {
                return task.save(function(err) {
                    should.not.exist(err);
                    done();
                });
            });

            it('should be able to show an error when try to save without time', function(done) {
                task.time = '';

                return task.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        });

        afterEach(function(done) {
            Task.remove({});
            User.remove({});
            done();
        });
        after(function(done) {
            Task.remove().exec();
            User.remove().exec();
            done();
        });
    });
});