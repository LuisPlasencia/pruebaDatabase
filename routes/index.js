var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Trabajo de TARCE', currentPage: 'home' });
});

module.exports = router;
