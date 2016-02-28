'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
   return res.status(422).json(err);
};

/**
 * Get a single user
 */
exports.show = function(req, res, next) {
   var userId = req.params.id;

   User.findById(userId, function(err, user) {
      if (err) return next(err);
      if (!user) return res.status(401).send('Unauthorized');
      res.json(user.profile);
   });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
   var userId = req.user._id;
   User.findOne({
      _id: userId
   }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
      if (err) return next(err);
      if (!user) return res.status(401).send('Unauthorized');
      res.json(user);
   });
};
