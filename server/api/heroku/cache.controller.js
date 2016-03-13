'use strict';

var Cache = require("./cache.model"),
   CacheEnum = require("../../enum/cache.enum");

function checkCache(req, res, next, options) {
   Cache
      .findOne(options)
      .lean()
      .exec(function (err, doc) {
         if (err) {
            console.log("Cache error:", err);
            return next();
         } else if (doc) {
            return res.json(doc.data.value);
         } else {
            next();
         }
      });
}

exports.apps = function (req, res, next) {
   var user = req.user;
   if (user.accessToken) {
      checkCache(req, res, next, {
         userToken: user.accessToken,
         type: CacheEnum.types.APPS
      });
   } else {
      next();
   }
};

exports.collaborators = function (req, res, next) {
   var appId = req.params.appId;
   if (appId) {
      checkCache(req, res, next, {
         appId: appId,
         type: CacheEnum.types.COLLABORATORS
      });
   } else {
      next();
   }
};

exports.config = function (req, res, next) {
   var appId = req.params.appId;
   if (appId) {
      checkCache(req, res, next, {
         appId: appId,
         type: CacheEnum.types.CONFIG
      });
   } else {
      next();
   }
};