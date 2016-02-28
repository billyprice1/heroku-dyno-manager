'use strict';

var HerokuService = require('./heroku.service');

// Get list of apps
exports.apps = function(req, res) {};

// Gets a list of dynos for a specific app
exports.dynos = function(req, res) {};

// Retstars given dyno.
exports.restart = function(req, res) {};

function handleError(res, err) {
   return res.status(500).send(err);
}
