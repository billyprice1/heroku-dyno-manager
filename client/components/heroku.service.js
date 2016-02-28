'use strict';

angular.module('herokuDynoManagerApp')
   .factory("HerokuApi", function ($resource) {
      return $resource("/api/heroku/:ctrl/:appId/:dynoId", {
         appId: "@appId",
         dynoId: "@dynoId"
      }, {
         apps: {
            method: "POST",
            isArray: true
         },
         dynos: {
            method: "POST",
            isArray: true,
            params: {
               ctrl: "dynos"
            }
         },
         restart: {
            method: "POST",
            params: {
               ctrl: "restart"
            }
         }
      });
   });