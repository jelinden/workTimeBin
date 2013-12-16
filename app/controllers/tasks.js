/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Task = mongoose.model('Task'),
    _ = require('underscore');


/**
 * Find task by id
 */
exports.task = function(req, res, next, id) {
    Task.load(id, function(err, task) {
        if (err) return next(err);
        if (!task) return next(new Error('Failed to load task ' + id));
        req.task = task;
        next();
    });
};

/**
 * Create a task
 */
exports.create = function(req, res) {
    var task = new Task(req.body);
    task.user = req.user;

    task.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                task: task
            });
        } else {
            res.jsonp(task);
        }
    });
};

/**
 * Update a task
 */
exports.update = function(req, res) {
    var task = req.task;

    task = _.extend(task, req.body);

    task.save(function(err) {
        res.jsonp(task);
    });
};

exports.destroy = function(req, res) {
    var task = req.task;

    task.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(task);
        }
    });
};

/**
 * Show an task
 */
exports.show = function(req, res) {
    res.jsonp(req.task);
};

/**
 * List of tasks
 */
exports.all = function(req, res) {
    Task.find({ "date": { $gte: getWeeksFirstDayAsDate() }}).and({"user": req.user._id }).sort('-date').populate('user', 'name username').exec(function(err, tasks) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(tasks);
        }
    });
    
    function getWeeksFirstDayAsDate() {
        var firstDayOfWeek = new Date();
        var index = firstDayOfWeek.getDay();
        if(index === 0) {
         firstDayOfWeek.setDate(firstDayOfWeek.getDate() - 6);
        }
        else if(index == 1) {
         firstDayOfWeek.setDate(firstDayOfWeek.getDate());
        }
        else if(index != 1 && index > 0) {
          firstDayOfWeek.setDate(firstDayOfWeek.getDate() - (index - 1));
        }
        firstDayOfWeek.setHours(0,0,0,0);
        return firstDayOfWeek;
    }
};
