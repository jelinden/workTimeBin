var express = require('express'),
    mongoStore = require('connect-mongo')(express),
    flash = require('connect-flash'),
    helpers = require('view-helpers'),
    config = require('./config');

module.exports = function(app, passport, db) {
    app.set('showStackError', true);    

    app.locals.pretty = true;

    app.use(express.compress({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    app.use(express.favicon());
    app.use(express.static(config.root + '/public'));

    if (process.env.NODE_ENV !== 'test') {
        app.use(express.logger('dev'));
    }

    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');

    app.enable("jsonp callback");

    app.configure(function() {
        app.use(express.cookieParser());
        app.use(express.urlencoded());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.session({
            secret: 'MEAN',
            store: new mongoStore({
                db: db.connection.db,
                collection: 'sessions'
            })
        }));
        app.use(flash());
        app.use(helpers(config.app.name));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(app.router);

        app.use(function(err, req, res, next) {
            //Treat as 404
            if (~err.message.indexOf('not found')) return next();
            console.error(err.stack);
            res.status(500).render('500', {
                error: err.stack
            });
        });

        app.use(function(req, res, next) {
            res.status(404).render('404', {
                url: req.originalUrl,
                error: 'Not found'
            });
        });

    });
};
