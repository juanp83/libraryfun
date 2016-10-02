var express = require('express');
var router = express.Router();

var knex = require('../db/knex');


router.post('/logout', function(req, res, next) {
  req.session = null;
  res.redirect('/');
});


module.exports = router;
