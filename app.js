var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let fillData = require('./fillData.js')
const mongoose = require('./mongoose.js')
const databaseRouter = require('./databaseRouter.js')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(databaseRouter)


// fillData.getData()




app.get('*', (req, res) => {
    res.send('404')
})

module.exports = app;
