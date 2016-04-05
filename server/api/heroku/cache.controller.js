'use strict';

var Cache = require("./cache.model"),
   CacheEnum = require("../../enum/cache.enum"),
   async = require("async");

function checkCache(req, res, next, options, transform) {
   if(req.headers.hasOwnProperty("x-hdm-bypass-cache")) {
      next();
   } else {
      Cache
         .findOne(options)
         .lean()
         .exec(function (err, doc) {
            if (err) {
               console.log("Cache error:", err);
               return next();
            } else if (doc) {
               if(transform && typeof transform === "function") {
                  transform(doc.data.value, function (err, data) {
                     return resp.json(data);
                  });
               } else {
                  return res.json(doc.data.value);
               }
            } else {
               next();
            }
         });
   }
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

exports.releases = function (req, res, next) {
   var appId = req.params.appId;
   if (appId) {
      checkCache(req, res, next, {
         appId: appId,
         type: CacheEnum.types.RELEASES
      }, transformReleases);
   } else {
      next();
   }
};

function transformReleases(data) {
   var items = [];
   async.each(data, function (item, iCB) {
      items.unshift(item);
      iCB();
   }, function () {
      cb(null, items);
   });
}