var express = require('express'),
    fs = require('fs'),
    passport = require('passport'),
    logger = require('mean-logger');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    config = require('./config/config'),
    auth = require('./config/middlewares/authorization'),
    mongoose = require('mongoose');

var db = mongoose.connect(config.db);

var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

require('./config/passport')(passport);

var app = express();

require('./config/express')(app, passport, db);
require('./config/routes')(app, passport, auth);

var port = process.env.PORT || config.port;
app.listen(port);
console.log('Express app started on port ' + port);

logger.init(app, passport, mongoose);

exports = module.exports = app;