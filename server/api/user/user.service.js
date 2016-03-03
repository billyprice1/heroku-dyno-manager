'use strict';

var User = require("./user.model"),
   EventEmitter = require("events").EventEmitter,
   Event = require("../../enum/event.enum"),
   async = require("async"),
   request = require("request");

exports.login = function (email, password) {
   var emitter = new EventEmitter(),
      token,
      tasks = [];

   tasks.push(function (cb) {
      var basicDigest = new Buffer(email + ":" + password).toString("base64");
      getAccessToken(basicDigest, function (err, authData) {
         if (err || !(authData && authData.access_token && authData.access_token.token)) {
            cb(err);
         } else {
            token = authData.access_token.token;
            cb(err, authData)
         }
      });
   });

   tasks.push(function (cb) {
      if(token) {
         getUserDetails(token, cb);
      } else {
         cb(new Error("No token found"));
      }
   });


   async.series(tasks, function (err, resp) {
      var auth = resp[0],
         userDetails = resp[1],
         user;

      if (err) {
         return emitter.emit(Event.ERROR, err);
      }

      if(userDetails && auth) {
         user =  new User({
            email: email,
            password: password,
            name: userDetails.name,
            accessToken: auth.access_token.token,
            provider: "heroku",
            heroku: userDetails
         });
         user.save(function (err, _user) {
            if(err) {
               console.log("Error registering user", err);
               return emitter.emit(Event.ERROR, err);
            }
            return emitter.emit(Event.SUCCESS, _user);
         });
      } else {
         return emitter.emit(Event.UNAUTHORIZED);
      }

   });

   return emitter;
};

function getAccessToken(basicDigest, cb) {
   var options = {
      url: 'https://api.heroku.com/oauth/authorizations',
      method: 'POST',
      headers: {
         'Accept': 'application/vnd.heroku+json; version=3',
         'Authorization': "Basic " + basicDigest
      }
   };

   request(options, function (err, response, body) {
      if (err) {
         console.log("Error authorizing user", err);
         return cb(err);
      }
      console.log("Authorization: responseCode", response.statusCode);
      if (response.statusCode === 200 || response.statusCode === 201) {
         if (typeof body === "string") {
            body = JSON.parse(body);
         }
         cb(null, body);
      } else {
         cb();
      }
   });
}

function getUserDetails(token, cb) {
   var options = {
      url: 'https://api.heroku.com/account',
      method: 'GET',
      headers: {
         'Accept': 'application/vnd.heroku+json; version=3',
         'Authorization': "Bearer " + token
      }
   };

   request(options, function (err, response, body) {
      if (err) {
         console.log("Error fetching user info", err);
         return cb(err);
      }
      console.log("UserDetails: responseCode", response.statusCode);
      if (response.statusCode === 200 || response.statusCode === 201) {
         if (typeof body === "string") {
            body = JSON.parse(body);
         }
         cb(null, body);
      } else {
         cb();
      }
   });
}
