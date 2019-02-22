var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config');

module.exports = function() {
	/* Launch login page. */
	router.get('/', function(req, res, next) {
		res.redirect('/links');
	});

	/* GET home page. */
	router.get('/links', function(req, res, next) {
		request.get({
			headers: { 'content-type' : 'application/json' },
			url:  config.url + '/v1/links'
		}, function (error, response, body) {
			if (response.statusCode === 200) {
				res.render('links', JSON.parse(body));
			} else {
				res.redirect('/links');
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
					link : req.body.link
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

	/* Put link count request */
	router.put('/links', function(req, res, next) {
		request.put({
			headers: { 'content-type' : 'application/json' },
			url:  config.url + '/v1/links',
			json: {
				'short-link' : req.body['short-link']
			}
		}, function (error, response, body) {
			if (response.statusCode === 200) {
				return res.redirect(body);
			} else {
				return res.status(500).send();
			}
		});
	});	

	return router;
};