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
  if( username === data.username && password == data.password) {
    return true;
  } else {
    return false;
  }
}




passport.use(new LocalStrategy(function(username, password, done) {
  db.Users.findOne({username : username })
    .then(function(data) {
      var isAuthenticated = authenticate(username, password, data);
      if(!isAuthenticated) {
        return done(null, false);
      }
      return done(null, data);
    })
    .catch(function(error) {
      console.log(error);
    });
}));

//can move get and post to a router middleware made for logins
app.get('/login', function (req, res) {
  if(req.user) {
    res.redirect('/');
  }
  res.render('gallery/login', {
    onLoginPage: true
  });
});

app.post('/login', passport.authenticate('local',
  {
    successRedirect : '/gallery',
    failureRedirect : '/login'

  }));

app.get('/', function(req,res) {
  if(req.user) {
    return res.redirect('/gallery');
  }
  res.redirect('/login');
});

app.use(function(req, res, next) {
  console.log(req.url);
  next();
});
app.use('/gallery', gallery);

app.use('/user', user);

app.delete('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.listen(3000, function() {
  console.log('Server Online on port 3000');
  db.sequelize.sync();
});