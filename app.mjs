


//var createError = require('http-errors');
import { default as express } from 'express';

//var express = require('express');

import { default as hbs } from 'hbs';

import * as path from 'path';

//var path = require('path');

// import * as favicon from 'serve-favicon';

import { default as logger } from 'morgan';

import { default as cookieParser } from 'cookie-parser';

//var cookieParser = require('cookie-parser');
//var logger = require('morgan');

import { default as bodyParser } from 'body-parser';

import * as http from 'http';

import { approotdir } from './approotdir.mjs';

const __dirname = approotdir;

import { normalizePort, onError, onListening, handle404, basicErrorHandler } from './appsupport.mjs';

import { router as indexRouter } from './routes/index.mjs';
import { router as notesRouter } from './routes/notes.mjs';

//   *********************************************************material-ui

import { default as rfs } from 'rotating-file-stream';



//   ********************************************************************


//  ***********************************************************
//  NotesStore code

import { InMemoryNotesStore } from './models/notes-memory.mjs';
export const NotesStore = new InMemoryNotesStore();


//   **********************************************************


// import { router as notesRouter } from './routes/notes.mjs';


//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

//var app = express();

// view engine setup


//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'hbs');

//app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

//// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  next(createError(404));
//});

//// error handler
//app.use(function(err, req, res, next) {
//  // set locals, only providing error in development
//  res.locals.message = err.message;
//  res.locals.error = req.app.get('env') === 'development' ? err : {};

//  // render the error page
//  res.status(err.status || 500);
//  res.render('error');
//});

//module.exports = app;




export const app = express();

app.use(logger(process.env.REQUEST_LOG_FORMAT ||'dev', {
    stream: process.env.REQUEST_LOG_FILE ? rfs.createStream(process.env.REQUEST_LOG_FILE, {
        size: '10M', interval: '1d', compress: 'gzip',
    })
    : process.stdout
}));


//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'partials'));
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger(process.env.REQUEST_LOG_FORMAT || 'dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets/vender/feather-icons', express.static(path.join(__dirname, 'node_modules', 'feather-icons', 'dist')));
app.use('assets/vendor/bootstrap', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist')));

app.use('/assets/vendor/bootstrap', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist')));
app.use('/assets/vendor/jquery', express.static(
    path.join(__dirname, 'node_modules', 'jquery', 'dist')));
app.use('/assets/vendor/popper.js', express.static(
    path.join(__dirname, 'node_modules', 'popper.js', 'dist', 'umd')));

// Router function lists
app.use('/', indexRouter);
app.use('/notes', notesRouter);

// error handlers
// catch 404 and forward to error handler
app.use(handle404);
app.use(basicErrorHandler);

//    ****************************************************


// Create a rotating file stream with some options
//const stream = rfs.createStream(logFileName, {
//    size: "10M", // rotate every 10 MegaBytes written
//    interval: "1d", // rotate daily
//    compress: "gzip", // compress rotated files
//    maxFiles: 10, // limit number of files
//    path: path.join(__dirname, "logs"), // specify the directory for logs
//});

//// Use morgan to log the requests to the stream
//app.use(logger("combined", { stream: stream }));



//if (process.env.REQUEST_LOG_FILE) {
//    app.use(logger(process.env.REQUEST_LOG_FORMAT || 'dev'));
//}

export const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);



export const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);



function logFileName(time, index) {
    if (!time) return "file.log";
    return [formatDate(time), index, "file.log"].join("-");
}



server.on('request', (req, res) => {
    debug(`${new Date().toISOString()}
    request ${req.mehtod}
     ${req.url}`);
});




