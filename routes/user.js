var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('./../models');
var bcrypt = require('bcrypt');
var Users = db.Users;


router.route('/register')
  .get(function (req, res) {
    res.render('user/register');
  })
  .post( function (req, res) {
    hash(req)
    .then (function(hash) {
      Users.create({
        username: req.body.username,
        password: hash,
        email_address: req.body.email_address
      })
    .then(function (user) {
      req.login(user, function(err) {
        if(err) {
          throw new Error(err);
        }
        return res.redirect('/gallery');
      });
    })
    .catch(function(error) {
      console.log(error);
    });
    });
  });

//can move get and post to a router middleware made for logins
router.get('/login', function (req, res) {
  console.log(req.session);
  if(req.user) {
    console.log('Redirecting to /');
    res.redirect('/');
  } else {
    console.log('About to render Login');
    res.render('gallery/login', {
      onLoginPage: true      //object is pased so Jade will use this to
    });
  }               //base decision on whether to render new post and logout button
});

function hash(req) {
  return new Promise (function(resolve, reject) {
  bcrypt.genSalt(12, function(err, salt) {
    if(err) {
      reject(err);
    }
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      console.log(hash);
      resolve (hash);
    });
  });
  });
}


  module.exports = router;