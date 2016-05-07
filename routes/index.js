var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/', function(req, res) {
	res.render('index', { title: 'Express' });
});

module.exports = router;