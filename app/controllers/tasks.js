/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Task = mongoose.model('Task'),
    _ = require('underscore'),
    $ = require('jquery');

/**
 * Find task by id
 */
exports.task = function(req, res, next, id) {
    Task.findOne({'_id': id}).populate('user', 'name username').exec(function(err, task) {
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
    var dateToBeFetched = new Date();
    var lastDateToBeFetched = new Date();

    if(req.query.fromDate !== 'undefined') {
        var parts = req.query.fromDate.split('-');
        req.fromDate = new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
    }
    if(req.fromDate !== undefined) {
        dateToBeFetched = req.fromDate;
    }
    var firstDayOfTheWeek = getWeeksFirstDayAsDate(dateToBeFetched);
    var weeksLastDayAsDate = getWeeksLastDayAsDate(new Date(firstDayOfTheWeek.getTime()));
    Task.find({ "date": { $gte: firstDayOfTheWeek, $lte: weeksLastDayAsDate }}).and({"user": req.user._id }).sort('-date').populate('user', 'name username').exec(function(err, tasks) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(tasks);
        }
    });
    
    function getWeeksFirstDayAsDate(dateToBeFetched) {
        var index = dateToBeFetched.getDay();
        if(index === 0) {
         dateToBeFetched.setDate(dateToBeFetched.getDate() - 6);
        }
        else if(index == 1) {
         dateToBeFetched.setDate(dateToBeFetched.getDate());
        }
        else if(index != 1 && index > 0) {
          dateToBeFetched.setDate(dateToBeFetched.getDate() - (index - 1));
        }
        dateToBeFetched.setHours(0,0,0,0);
        return dateToBeFetched;
    }
    
    function getWeeksLastDayAsDate(dateToBeFetched) {
        var index = dateToBeFetched.getDay();
        if(index === 0) {
         dateToBeFetched.setDate(dateToBeFetched.getDate());
        }
        else if(index == 1) {
         dateToBeFetched.setDate(dateToBeFetched.getDate() + 6);
        }
        else if(index != 1 && index > 0) {
          dateToBeFetched.setDate(dateToBeFetched.getDate() + (index - 1));
        }
        dateToBeFetched.setHours(0,0,0,0);
        return dateToBeFetched;
    }
};
