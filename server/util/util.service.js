'use strict';

var config = require("../config/environment");

exports.getConfig = function (req, res) {

   var clientConfig = {
      heroku: {
         client_id: process.env.HEROKU_CLIENT || config.heroku.client_id
      }
   };

   var scriptData = "'use strict'; angular.module('herokuDynoManagerApp')" +
      ".constant('AppConfig'," +
      JSON.stringify(clientConfig) +
      ")";
   res.header("Content-Type", "text/javascript");
   res.status(200).send(scriptData);
};