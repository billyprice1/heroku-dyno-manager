'use strict';

angular.module('herokuDynoManagerApp')
   .controller("HerokuCtrl", function (HerokuApi) {
      var self = this;

      HerokuApi.apps({}, function (resp) {
         self.apps = resp;
      });
   })
   .controller("HerokuAppCtrl", function (HerokuApi, $stateParams) {
      var self = this;

      self.appName = $stateParams.appId;
      //HerokuApi.dynos({
      //   appId: self.appName
      //}, function (resp) {
      //   self.dynos = resp;
      //});

      self.dynos = [
         {
            "attach_url": null,
            "command": "node --optimize_for_size --max_old_space_size=960 --expose-gc dist/server/app.js",
            "created_at": "2016-02-29T04:27:43Z",
            "id": "0b1c35df-fbdd-495f-bded-5053ce16821d",
            "name": "web.1",
            "app": {"id": "80332a31-03dd-4eec-b517-4517061cdb93", "name": "prod-kokaihop"},
            "release": {"id": "5a3c3d81-774c-4f5f-bddc-8cd93133c2bb", "version": 386},
            "size": "Standard-2X",
            "state": "up",
            "type": "web",
            "updated_at": "2016-02-29T04:27:43Z"
         },
         {
            "attach_url": null,
            "command": "node --optimize_for_size --max_old_space_size=460 dist/server/worker.js",
            "created_at": "2016-02-28T21:08:39Z",
            "id": "6fbed194-0af4-4eeb-96e1-a3783db2beae",
            "name": "worker.1",
            "app": {"id": "80332a31-03dd-4eec-b517-4517061cdb93", "name": "prod-kokaihop"},
            "release": {"id": "5a3c3d81-774c-4f5f-bddc-8cd93133c2bb", "version": 386},
            "size": "Standard-1X",
            "state": "up",
            "type": "worker",
            "updated_at": "2016-02-28T21:08:39Z"
         }
      ];

      self.restart = function (dynoId, idx) {
         self.dynos[idx].restartRequestSent = true;
      };
   });


/*
 SAMPLE APP DATA
 {
 "archived_at": null,
 "buildpack_provided_description": "Node.js",
 "build_stack": {"id": "<some-id>", "name": "cedar-14"},
 "created_at": "2015-06-06T07:35:49Z",
 "id": "<app-id>",
 "git_url": "<git-url>",
 "maintenance": false,
 "name": "<app-name>",
 "owner": {"email": "<user-email>", "id": "<user-id>"},
 "region": {"id": "<region-id>", "name": "eu"},
 "space": null,
 "released_at": "2015-06-06T07:41:05Z",
 "repo_size": 46723,
 "slug_size": 12097643,
 "stack": {"id": "<stack-id>", "name": "cedar-14"},
 "updated_at": "2015-06-06T07:42:05Z",
 "web_url": "<web-page-url>"
 }

 DYNO
 {
 "attach_url": null,
 "command": "<dyno start command>",
 "created_at": "2016-02-28T19:02:10Z",
 "id": "<dyno-id>",
 "name": "web.1",
 "app": {"id": "<app-id>", "name": "<app-name>"},
 "release": {"id": "<release-id>", "version": 386},
 "size": "Standard-2X",
 "state": "up",
 "type": "web",
 "updated_at": "2016-02-28T19:02:10Z"
 }

 */
