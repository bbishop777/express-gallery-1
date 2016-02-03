var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('./../models');

var Photo = db.Photo;

// router for /
router.route('/')
  .get(function(req, res) {
    if(req.user) {
      Photo.findAll()
    .then(function(data) {
      res.render('gallery/index', {
        "Photos": data
      });
    })
    .catch(function(error) {
      console.log(error);
    });
    } else {
      res.redirect('/');
    }
  })
  .post(function (req, res) {
    if(req.user) {
      Photo.create({
        author: req.body.author,
        link: req.body.link,
        description: req.body.description
      })
        .then(function (photo) {
          res.json(photo);
        });
    } else {
      res.redirect('/');
    }
});


// router for /new
router.route('/new')
  .get(function(req, res) {
    if(req.user) {
      res.render('gallery/new');
    } else {
      res.redirect('/');
    }
  })
  .post(function (req, res) {
    if(req.user) {
      Photo.create({
        author: req.body.author,
        link: req.body.link,
        description: req.body.description
      })
      .then(function (data) {
        res.redirect('/gallery');
      });
    } else {
      res.redirect('/');
    }
  });

// router for /gallery/:id
router.route('/:id')
  .get(function(req, res) {
    if(req.user){
      Photo.find({
        where : {
          id : req.params.id
        }
      })
    .then(function(data) {
      res.render('gallery/single', {
        "Photo": data.dataValues
      });
    })
    .catch(function(err) {
      console.log(err);
      res.send({ 'success': false});
    });
    } else {
      res.redirect('/');
    }
  })
  .put(function(req, res) {
    console.log("Whyyyy");
    if(req.user){
      Photo.findById(req.params.id)
      .then(function(data) {
        data.update({
          link : req.body.link,
          description : req.body.description,
          author : req.body.author
        })
      .then(function (data) {
        res.render('gallery/single', {
          "Photo" : data.dataValues
        } );
      });
      })
      .catch(function(err) {
        console.log(err);
        res.send({'success': false});
      });
    } else {
      res.redirect('/');
    }
  })
  .delete(function(req,res){
     Photo.destroy({
      where : {
        id : req.params.id
      }
    })
    .then(function(data) {
      res.redirect('/gallery');
    });
  });

router.get('/:id/edit', function(req, res) {
  if(req.user) {
    Photo.find({
        where : {
          id : req.params.id
        }
      })
    .then(function(data) {
      res.render('gallery/edit', {
        "Photo": data.dataValues
      });
    });
  } else {
      res.redirect('/');
  }
});

module.exports = router;