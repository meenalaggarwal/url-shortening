var express = require('express');
var router = express.Router();
var uniqid = require('uniqid');
var linkQuery = require('../DAO/links.js');

module.exports = function (app) {

	router.get('/links', function(req, res, next) {
		linkQuery.getLinksList(app.db.client)
		.then(function(linksList) {
			return res.status(200).send(linksList);
		}).catch(function(err) {
			return res.status(400).send(err);
		});
	});

	router.post('/links', function(req, res, next) {
		if (req.body.link) {
			var uid = uniqid();
			var obj = {
				'short-link': uid,
				'link': req.body.link
			}
			linkQuery.findOrInsertLink(app.db.client, obj)
			.then(function(res) {
				return res.status(200).send(linksList);
			}).catch(function(err) {
				return res.status(400).send(err);
			});
		} else {
			return res.status(400).send('BadRequest');	
		}
	});

	router.get('/links/:link', function(req, res, next) {

	});
};
