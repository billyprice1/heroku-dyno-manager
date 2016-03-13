'use strict';

var Cache = require("./cache.model"),
   CacheEnum = require("../../enum/cache.enum");

exports.apps = function (req, res, next) {
   var user = req.user;
   if (user.accessToken) {
      Cache
         .findOne({userToken: user.accessToken, type: CacheEnum.types.APPS})
         .lean()
         .exec(function (err, doc) {
            if(err) {
               console.log("Cache error:", err);
               return next();
            } else if(doc) {
               return res.json(doc.data.value);
            } else {
               next();
            }
         });
   } else {
      next();
   }
};

exports.collaborators = function (req, res, next) {
   var appId = req.params.appId;
   if (appId) {
      Cache
         .findOne({appId: appId, type: CacheEnum.types.COLLABORATORS})
         .lean()
         .exec(function (err, doc) {
            if(err) {
               console.log("Cache error:", err);
               return next();
            } else if(doc) {
               return res.json(doc.data.value);
            } else {
               next();
            }
         });
   } else {
      next();
   }
};

exports.config = function (req, res, next) {
   var appId = req.params.appId;
   if (appId) {
      Cache
         .findOne({appId: appId, type: CacheEnum.types.CONFIG})
         .lean()
         .exec(function (err, doc) {
            if(err) {
               console.log("Cache error:", err);
               return next();
            } else if(doc) {
               return res.json(doc.data.value);
            } else {
               next();
            }
         });
   } else {
      next();
   }
};