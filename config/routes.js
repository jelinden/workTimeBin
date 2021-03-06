'use strict';

module.exports = function(app, passport, auth) {
    var users = require('../app/controllers/users');
    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/signout', users.signout);
    app.get('/users/me', users.me);
    app.post('/users', users.create);
    app.param('userId', users.user);
    
    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: true
    }), users.session);

    //Tasks Routes
    var tasks = require('../app/controllers/tasks');
    app.get('/tasks/from/:fromDate', tasks.all);
    app.get('/tasks', tasks.all);
    app.post('/tasks', auth.requiresLogin, tasks.create);
    app.get('/tasks/:taskId', tasks.show);
    app.put('/tasks/:taskId', auth.requiresLogin, auth.task.hasAuthorization, tasks.update);
    app.del('/tasks/:taskId', auth.requiresLogin, auth.task.hasAuthorization, tasks.destroy);

    //Finish with setting up the taskId param
    app.param('taskId', tasks.task);

    //Home route
    var index = require('../app/controllers/index');
    app.get('/', index.render);

};
