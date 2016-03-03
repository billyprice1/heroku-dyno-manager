'use strict';

var Heroku = require("./heroku.model"),
   request = require("request"),
   async = require("async"),
   config = require("../../config/environment"),
   Event = require("../../enum/event.enum"),
   EventEmitter = require("events").EventEmitter;

exports.apps = function (url, method, user) {
   var options = {
         url: 'https://api.heroku.com/apps',
         method: 'GET',
         headers: {
            'Accept': 'application/vnd.heroku+json; version=3'
         }
      },
      emitter = new EventEmitter();

   if (user.accessToken) {
      options.headers.Authorization = "Bearer " + resp[0].accessToken;
      if(url) {
         options.url = url;
         options.method = method || "GET"
      }
      request(options, function (err, response, body) {
         if (err) {
            return emitter.emit(Event.ERROR, err);
         }
         if (response.statusCode === 200) {
            return emitter.emit(Event.SUCCESS, JSON.parse(body));
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
   return exports.apps('https://api.heroku.com/apps/' + appId + '/dynos', "GET", user);
};

exports.restart = function (appId, dynoId, user) {
   return exports.apps('https://api.heroku.com/apps/' + appId + '/dynos/' + dynoId, "DELETE", user);
};

exports.authorize = function (code) {
   var tasks = [],
      needsRefresh = false,
      refreshToken = "",
      hasDocument = false,
      emitter = new EventEmitter();

   tasks.push(function (cb) {
      Heroku.findOne().lean().exec(function (err, doc) {
         if (err) {
            console.log("Error Cannot find the heroku document",
               err);
            return cb(err);
         }
         if (doc) {
            if (doc.expires <= Date.now()) {
               //token expired, get a new one
               needsRefresh = true;
               refreshToken = doc.refreshToken;
               console.log("Access token has expired. Will need to get a new one.");
            }
            hasDocument = true;
         }
         return cb(null, doc);
      });
   });

   tasks.push(function (cb) {
      if (hasDocument && !needsRefresh) {
         console.log("Access token is valid, not fetching a new one.");
         cb();
      } else {
         getAccessToken({
            refresh: needsRefresh,
            code: code,
            refreshToken: refreshToken || null
         }, function (err, data) {
            if (err) {
               console.log("Error getting accessToken", err);
               cb(err);
            } else {
               cb(null, data);
            }
         });
      }
   });

   async.series(tasks, function (err, resp) {
      var doc = resp[0],
         data = resp[1];
      if (err) {
         return emitter.emit(Event.ERROR, err);
      }
      if (doc && needsRefresh) {
         Heroku.update({
            _id: doc._id
         }, {
            $set: {
               accessToken: data.access_token,
               expires: Date.now() + (data.expires_in * 1000)
            }
         }, function (err, count) {
            doc.accessToken = data.access_token;
            respond(err, doc);
         });
      } else if (code || !doc) {
         var newDoc = new Heroku({
            accessToken: data.access_token,
            expires: Date.now() + (data.expires_in * 1000),
            refreshToken: data.refresh_token
         });

         newDoc.save(respond);
      } else {
         respond(null, doc);
      }
   });

   function respond(err, resp) {
      if (err) {
         console.log("Error saving/updating heroku doc", err);
         return emitter.emit(Event.ERROR, err);
      }
      return emitter.emit(Event.SUCCESS, resp);
   }

   return emitter;
};

function getAccessToken(options, cb) {
   var req_obj = {
         url: "https://id.heroku.com/oauth/token",
         method: "POST",
         json: true
      },
      body = {
         client_secret: config.heroku.client_secret,
         grant_type: "authorization_code"
      };

   if (options.refresh) {
      body.grant_type = "refresh_token";
      body.refresh_token = options.refreshToken;
   } else {
      body.code = options.code;
   }

   req_obj.form = body;

   console.log("Fetching new access token with these options:");
   console.log(req_obj, "\n\n");
   request(req_obj, function (err, resp, body) {
      if (err) {
         return cb(err);
      }
      if (resp.statusCode === 200) {
         return cb(null, body);
      }
      return cb();
   });
}
