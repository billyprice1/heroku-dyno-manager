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
    HerokuApi.dynos({
      appId: self.appName
    }, function (resp) {
      resp.forEach(function (dyno) {
        dyno.created_at = moment(dyno.created_at).fromNow();
      });
      self.dynos = resp;
    });

    self.restart = function (dynoId, idx) {
      HerokuApi.restart({
        appId: self.appName,
        dynoId: dynoId
      }, function (resp) {
        console.log(resp);
        self.dynos[idx].restartRequestSent = true;
      });
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
