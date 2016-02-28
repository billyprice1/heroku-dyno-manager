'use strict';

angular.module('herokuDynoManagerApp')
   .config(function ($stateProvider) {
      $stateProvider
         .state('main.apps', {
            url: 'apps',
            authenticate: true,
            templateUrl: 'app/heroku/heroku.apps.html',
            controller: 'HerokuCtrl as heroku'
         })
         .state('main.apps.show', {
            url: '/:appId',
            authenticate: true,
            templateUrl: 'app/heroku/heroku.show.html',
            controller: 'HerokuAppCtrl as heroku'
         });
   });