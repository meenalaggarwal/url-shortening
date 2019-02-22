var MongoClient = require('mongodb').MongoClient;
var Promise = require("bluebird");

module.exports = function(config) {
	return new Promise(function (resolve, reject) {
		MongoClient.connect(config.url, function(err, client) {
			if(err) {
				return reject(err);
			} else {
				var db = client.db(config.dbName);		
				return resolve(db);
			}
		});	
	});
};