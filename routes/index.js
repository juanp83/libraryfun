var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

var knex = require('../db/knex');


router.post('/signup', function(req, res, next) {
  var password = bcrypt.hashSync(req.body.password, 8);
  console.log(req.body);
  knex('users').where({username: req.body.username.toLowerCase()}).then(function(data) {
    if (data.length) {
      res.send('That username already exists')
    } else {
      knex('users').insert({
        username: req.body.username.toLowerCase(),
        password: password,
        first_name: req.body.first_name,
        last_name: req.body.last_name
      })
        .returning('id')
        .then(function(id) {
          req.session.id = id;
          res.redirect('/session.html');
        })
    }
  });
});


router.post('/login', function(req, res, next) {
  knex('users')
    .where({username: req.body.username.toLowerCase()})
    .first()
    .then(function(data) {
      if (!data) {
        res.send('That login is invalid.');
      }
      if (bcrypt.compareSync(req.body.password, data.password)) {
        req.session.id = data.id;
        res.redirect('/session.html');
      } else {
        res.send('That login is invalid');
      }
  });
});


module.exports = router;
