'use strict';

angular.module('herokuDynoManagerApp')
   .controller('NavbarCtrl', function ($scope, $location, Auth, AppConfig) {
      $scope.menu = [{
         'title': 'Home',
         'link': '/'
      }];

      $scope.isCollapsed = true;
      $scope.isLoggedIn = Auth.isLoggedIn;
      $scope.isAdmin = Auth.isAdmin;
      $scope.getCurrentUser = Auth.getCurrentUser;

      $scope.logout = function () {
         Auth.logout();
         $location.path('/login');
      };

      $scope.isActive = function (route) {
         return route === $location.path();
      };
   });