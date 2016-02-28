'use strict';

angular.module('herokuDynoManagerApp')
   .controller("HerokuCtrl", function (HerokuApi) {
      var self = this;

      HerokuApi.apps({}, function (resp) {
         console.log(resp);
         self.apps = resp;
      });
   })
   .controller("HerokuAppCtrl", function () {

   });