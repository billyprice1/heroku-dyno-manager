'use strict';

var Heroku = require("./heroku.model"),
   request = require("request"),
   async = require("async"),
   config = require("../../config/environment"),
   Event = require("../../enum/event.enum"),
   Cache = require("./cache.model"),
   CacheEnum = require("../../enum/cache.enum"),
   EventEmitter = require("events").EventEmitter;

exports.apps = function (url, method, user, data, cacheOptions) {
   var options = {
         url: 'https://api.heroku.com/apps',
         method: 'GET',
         headers: {
            'Accept': 'application/vnd.heroku+json; version=3',
            'Content-Type': 'application/json'
         }
      },
      emitter = new EventEmitter();

   if (user.accessToken) {
      options.headers.Authorization = "Bearer " + user.accessToken;
      if (url) {
         options.url += url;
         options.method = method || "GET"
      }
      if (data) {
         options.body = data;
      }
      request(options, function (err, response, body) {
         var _body, newCache, _cache;
         if (err) {
            return emitter.emit(Event.ERROR, err);
         }
         if (response.statusCode === 200 || (response.statusCode >= 203 && response.statusCode < 299)) {
            try {
               _body = JSON.parse(body);
               if (cacheOptions && cacheOptions.type) {
                  _cache = {
                     data: {value: _body},
                     userToken: user.accessToken,
                     type: cacheOptions.type
                  };
                  if (cacheOptions.appId) {
                     _cache["appId"] = cacheOptions.appId;
                  }
                  newCache = new Cache(_cache);

                  newCache.save(function (err, doc) {
                     console.log("Saving cache for", cacheOptions.type, err);
                  });
               }
            } catch (e) {
               console.log("Error parsing JSON body", typeof body, e);
               return emitter.emit(Event.SUCCESS, {});
            }
            return emitter.emit(Event.SUCCESS, _body);
         } else if (response.statusCode === 202) {
            return emitter.emit(Event.SUCCESS, {msg: "Request accepted"});
         }
         return emitter.emit(Event.NOT_FOUND);
      });
   } else {
      return emitter.emit(Event.NOT_FOUND);
   }

   return emitter;
};

exports.dynos = function (appId, user) {
   return exports.apps('/' + appId + '/dynos', "GET", user);
};

exports.restart = function (appId, dynoId, user) {
   return exports.apps('/' + appId + '/dynos/' + dynoId, "DELETE", user);
};

exports.listCollaborators = function (appId, user) {
   return exports.apps('/' + appId + '/collaborators', "GET", user, null, {
      type: CacheEnum.types.COLLABORATORS,
      appId: appId
   });
};

exports.releases = function (appId, user) {
   return exports.apps('/' + appId + '/releases', "GET", user, null, {
      type: CacheEnum.types.RELEASES,
      appId: appId
   });
};

exports.rollbackRelease = function (appId, releaseId, user) {
   var data = {
      release: releaseId
   };
   return exports.apps('/' + appId + '/releases', "POST", user, data);
};

exports.getCollaborator = function (appId, collaboratorId, user) {
   return exports.apps('/' + appId + '/collaborators/' + collaboratorId, "GET", user);
};

exports.removeCollaborator = function (appId, collaboratorId, user) {
   return exports.apps('/' + appId + '/collaborators/' + collaboratorId, "DELETE", user);
};

exports.createCollaborator = function (appId, emailId, user) {
   var data = {
      silent: false,
      user: emailId
   };
   return exports.apps('/' + appId + '/collaborators', "POST", user, data);
};

exports.getConfig = function (appId, user) {
   return exports.apps('/' + appId + '/config-vars', "GET", user, null, {
      type: CacheEnum.types.CONFIG,
      appId: appId
   });
};

exports.setConfigVar = function (appId, config, user) {
   var data = {};
   for (var i in config) {
      if (config.hasOwnProperty(i)) {
         data[i] = config[i];
      }
   }
   return exports.apps('/' + appId + '/config-vars', "PATCH", user, data);
};

exports.removeConfigVar = function (appId, config, user) {
   var data = {};
   for (var i in config) {
      if (config.hasOwnProperty(i)) {
         data[i] = "NULL";
      }
   }
   return exports.apps('/' + appId + '/config-vars', "PATCH", user, data);
};