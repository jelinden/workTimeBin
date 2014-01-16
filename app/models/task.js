'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Task Schema
 */
var TaskSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    date: {
        type: Date,
        default: Date.now,
        trim: true
    },
    time: {
        type: String,
        default: '',
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Validations
 */
TaskSchema.path('date').validate(function(date) {
    return date.length;
}, 'Date cannot be blank');

TaskSchema.path('time').validate(function(time) {
    return time.length;
}, 'Time cannot be blank');
/**
 * Statics
 */
TaskSchema.statistics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).populate('user', 'name username').exec(cb);
    }
};

mongoose.model('Task', TaskSchema);