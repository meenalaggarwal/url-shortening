var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config');

/* Launch login page. */
router.get('/', function(req, res, next) {
	res.redirect('/links');
});

/* GET home page. */
router.get('/links', function(req, res, next) {
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

/* Shortening URL request */
router.post('/links', function(req, res, next) {
	var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
	if (req.body.link && re.test(req.body.link)) {
		request.post({
			headers: { 'content-type' : 'application/json' },
			url:  config.url + '/v1/links',
			json: {
				data: { link : req.body.link}
			}
		}, function (error, response, body) {
			if (response.statusCode === 200) {
				return res.status(200).send( {linkid: body });
			} else {
				return res.status(500).send();
			}
		});
	} else {
		return res.status(400).send('BadRequest');
	}
});

/* Get link request */
router.get('/links/:linkid', function(req, res, next) {
	request.get({
		headers: { 'content-type' : 'application/json' },
		url:  config.url + '/v1/links/' + req.params.linkid,
	}, function (error, response, body) {
		if (response.statusCode === 200) {
			return res.redirect(body);
		} else {
			return res.status(500).send();
		}
	});
});


module.exports = router;