'use strict';

const express = require('express');
const routes = require('./routes.js');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

const app = express();
require('dotenv').load();
require('./config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);

app.use('/public', express.static('public'));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'pug');
app.set('views', 'views');

routes(app, passport);
// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});