var express = require('express');
var methodOverride = require('method-override');
var router = express.Router();
var bodyParser = require('body-parser');
var gallery = require('./routes/gallery.js');
var user = require('./routes/user.js');
var db = require('./models');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var CONFIG = require('/config');
var SECRETKEYS = [];
var cookieParser = require('cookie-parser');
var app = express();
var bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({
  extended : true
}));

app.use(methodOverride(function(req, res) {
  if(req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

//
app.use(express.static('public'));

// for jade
app.set('view engine', 'jade');
app.set('views', 'templates');

app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
// app.use(app.router);

passport.serializeUser(function(user, done) {
  return done(null, user);
});

passport.deserializeUser(function(user, done) {
  return done(null, user);
});

function authenticate(username, password, data) {
  console.log(username, data.username);
  if(username === data.username)  {
    return compare(password, data);
  } else {
    console.log('Usernames dont match');
    return false;
  }
}

function compare(password, data) {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(password, data.password, function (err, res){
      resolve(res);
    });
  });
}

passport.use(new LocalStrategy(function(username, password, done) {
  console.log('Local Strategy in action');
  db.Users.find({
    where:
    {
      username : username
    }
  })
    .then(function(data) {
      var isAuthenticated = authenticate(username, password, data);
      console.log(isAuthenticated);
      if(!isAuthenticated) {
        console.log('Not Working');
        return done(null, false);
      }
      console.log('Authenticated');
      return done(null, data);
    })
    .catch(function(error) {
      console.log(error);
    });
}));

app.post('/login', passport.authenticate('local',
  {
    successRedirect : '/gallery',
    failureRedirect : '/login'

  }));


// app.use(function(req, res, next) {
//   console.log(req.url, req.url ==='/user/register', 'Should happen everytime');
//   if(!req.user && (req.url !== '/login')) {
//     res.redirect('/login');
//   } else if(!req.user && (req.url !== '/user/register')) {
//     console.log('Here?');
//     res.redirect('/user/register');
//   } else {
//     next();
//   }
// });

app.use('/gallery', gallery);

app.use(user);

function isAuthenticated(req, res, next) {
  if(!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  return next();
}

app.get('/', function(req,res) {
  return res.redirect('/gallery');
});




app.delete('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.listen(3000, function() {
  console.log('Server Online on port 3000');
  db.sequelize.sync();
});