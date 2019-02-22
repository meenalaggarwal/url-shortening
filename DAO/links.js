var Promise = require("bluebird");

module.exports.getLinksList = function(dbClient) {
	return new Promise(function (resolve, reject) {
		var collection = dbClient.collection('linksDetails');
		collection.find().toArray(function(err, result) {
			if (err) {
				return reject(err);
			} else if (result) {
				var links = [];
				for (var i = 0; i < result.length; i++) {
					links.push({
						'short-link': result[i]['short-link'],
						'hit-count':  result[i]['hit-count'],
						'link':  result[i]['link']
					});
				}
				return resolve(links);
			}
		});
	});	
};


module.exports.findOrInsertLink = function(dbClient, linkObj) {
	return new Promise(function (resolve, reject) {
		var collection = dbClient.collection('linksDetails');
		collection.findOne({'link' : linkObj.link}, function(err, result) {
			if (err) {
				return reject(err);
			}
			if (result) {
				return resolve({bAlreadyExists: true});
			} else {
				collection.insert({'link' : linkObj.link, 'short-link': linkObj['short-link']}, function(err, result) {
					if (err) {
						return reject(err);
					} else {
						return resolve({bAlreadyExists: false});
					}
				});
			}
		});
	});
};

module.exports.updateCount = function(dbClient, shortLink) {
	return new Promise(function (resolve, reject) {
		var collection = dbClient.collection('linksDetails');
		collection.update({'short-link': shortLink}, { $inc: {'hit-count': 1} }, function(err, result) {
			if (err) {
				return reject(err);
			} else {
				return resolve();
			}
		});
	});
}