/*jslint browser: true, regexp: true */
/*global module, require */

var config = {
	base_url: {
		protocol: 'https',
		host: 'api.smugmug.com',
		pathname: '/services/api/json/1.3.0/'
	},
	login_url: {
		protocol: 'https',
		host: 'api.smugmug.com',
		pathname: '/hack/json/1.2.0/'
	}
};

var url_utils = require('url');
var Q = require('q');

var utils = {
	generate_url: function (params) {
		'use strict';
		var url_obj = config.base_url;

		params.APIKey = config.api_key;
		params.SessionID = config.session_id;

		url_obj.query = params;

		return url_utils.format(url_obj);
	},
	get_json: function (url) {
		'use strict';
		var request = require("request"),
			deferred = Q.defer();

		request({
			url: url,
			json: true
		}, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				deferred.resolve(body);
			} else if (response.statusCode !== 200) {
				deferred.reject(new Error('Non 200 error code'));
			} else {
				deferred.reject(error);
			}
		});

		return deferred.promise;
	}
};

module.exports = {
	config: function (configuration) {
		'use strict';
		var key;

		for (key in configuration) {
			if (configuration.hasOwnProperty(key)) {
				config[key] = configuration[key];
			}
		}
	},
	login: {
		anon: function () {
			'use strict';
			var params, url, url_obj,
				deferred = Q.defer();

			params = {
				method: 'smugmug.login.anonymously',
				APIKey: config.api_key
			};

			url_obj = config.login_url;
			url_obj.query = params;

			url = url_utils.format(url_obj);

			utils.get_json(url).then(function (session_data) {
				config.session_id = session_data.Login.Session.id;

				deferred.resolve();
			}).fail(function (error) {
				deferred.reject(error);
			});

			return deferred.promise;
		}
	},
	albums: {
		get: function (name, options) {
			'use strict';
			var params, url, options_key,
				deferred = Q.defer();

			params = {
				method: 'smugmug.albums.get',
				NickName: name
			};

			if (options) {
				for (options_key in options) {
					if (options.hasOwnProperty(options_key)) {
						params[options_key] = options[options_key];
					}
				}
			}

			url = utils.generate_url(params);

			utils.get_json(url).then(function (album_data) {
				if (album_data.stat === 'fail') {
					deferred.reject(new Error(album_data.message));
				}

				deferred.resolve(album_data);
			}).fail(function (error) {
				deferred.reject(error);
			});

			return deferred.promise;
		},
		getInfo: function (id, key, options) {
			'use strict';
			var params, url, options_key,
				deferred = Q.defer();

			params = {
				method: 'smugmug.albums.getInfo',
				AlbumID: id,
				AlbumKey: key
			};

			if (options) {
				for (options_key in options) {
					if (options.hasOwnProperty(options_key)) {
						params[options_key] = options[options_key];
					}
				}
			}

			url = utils.generate_url(params);

			utils.get_json(url).then(function (album_data) {
				if (album_data.stat === 'fail') {
					deferred.reject(new Error(album_data.message));
				}

				deferred.resolve(album_data);
			}).fail(function (error) {
				deferred.reject(error);
			});

			return deferred.promise;
		}
	},
	images: {
		get: function (id, key, options) {
			'use strict';
			var params, url, options_key,
				deferred = Q.defer();

			params = {
				method: 'smugmug.images.get',
				AlbumID: id,
				AlbumKey: key
			};

			if (options) {
				for (options_key in options) {
					if (options.hasOwnProperty(options_key)) {
						params[options_key] = options[options_key];
					}
				}
			}

			url = utils.generate_url(params);

			utils.get_json(url).then(function (image_data) {
				if (image_data.stat === 'fail') {
					deferred.reject(new Error(image_data.message));
				}

				deferred.resolve(image_data);
			}).fail(function (error) {
				deferred.reject(error);
			});

			return deferred.promise;
		}
	},
	utils: utils
};