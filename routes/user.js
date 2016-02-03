var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('./../models');

var Users = db.Users;


router.route('/login')
  .post( function (req, res) {
    Users.create({
      username: req.body.username,
      password: req.body.password,
      email_address: req.body.email_address
    })
    .then(function (user) {
      res.json(user);
    })
    .catch(function(error) {
      console.log(error);
    });
  });


  module.exports = router;