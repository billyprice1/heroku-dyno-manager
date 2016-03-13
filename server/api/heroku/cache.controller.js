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