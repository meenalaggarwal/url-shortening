var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config');

/* GET home page. */
router.get('/', function(req, res, next) {
	request.get({
		headers: { 'content-type' : 'application/json' },
		url:  config.url + '/v1/links',
	}, function (error, response, body) {
		if (response.statusCode === 200) {
			return res.render('links', { data: JSON.stringify(body)});
		} else {
			return res.status(500).send();
		}
	});
});

module.exports = router;
