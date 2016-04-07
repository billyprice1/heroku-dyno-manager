'use strict';

var HerokuService = require('./heroku.service'),
   Event = require("../../enum/event.enum"),
   async = require("async"),
   crypto = require("crypto"),
   CacheEnum = require("../../enum/cache.enum");

// Get list of apps
exports.apps = function (req, res) {
   HerokuService.apps(null, null, req.user, null, {
      type: CacheEnum.types.APPS
   })
      .once(Event.ERROR, function (err) {
         return handleError(res, err);
      })
      .once(Event.NOT_FOUND, function () {
         return res.status(404).send("Not found");
      })
      .once(Event.SUCCESS, function (resp) {
         return res.json(resp);
      });
};

// Gets a list of dynos for a specific app
exports.dynos = function (req, res) {
   var appId = req.params.appId;
   HerokuService.dynos(appId, req.user)
      .once(Event.ERROR, function (err) {
         return handleError(res, err);
      })
      .once(Event.NOT_FOUND, function () {
         return res.status(404).send("Not found");
      })
      .once(Event.SUCCESS, function (resp) {
         return res.json(resp);
      });
};

// Restarts a given dyno.
exports.restart = function (req, res) {
   var appId = req.params.appId,
      dynoId = req.params.dynoId;

   HerokuService.restart(appId, dynoId, req.user)
      .once(Event.ERROR, function (err) {
         return handleError(res, err);
      })
      .once(Event.NOT_FOUND, function () {
         return res.status(404).send("Not found");
      })
      .once(Event.SUCCESS, function (resp) {
         return res.json(resp);
      });
};

// Gets a list of collaborators for a specific app
exports.listCollaborators = function (req, res) {
   var appId = req.params.appId;

   var createEmailHashes = function (data, cb) {
      var items = [];
      async.each(data, function (d, iCB) {
         d.emailHash = crypto.createHash("md5").update(d.user.email).digest("hex");
         items.push(d);
         iCB();
      }, function () {
         cb(null, items);
      });
   };

   HerokuService.listCollaborators(appId, req.user)
      .once(Event.ERROR, function (err) {
         return handleError(res, err);
      })
      .once(Event.NOT_FOUND, function () {
         return res.status(404).send("Not found");
      })
      .once(Event.SUCCESS, function (resp) {
         createEmailHashes(resp, function (err, data) {
            return res.json(data);
         });
      });
};

// Gets single collaborators for a specific app
exports.getCollaborator = function (req, res) {
   var appId = req.params.appId,
      collaboratorId = req.params.collaboratorId;

   HerokuService.getCollaborator(appId, collaboratorId, req.user)
      .once(Event.ERROR, function (err) {
         return handleError(res, err);
      })
      .once(Event.NOT_FOUND, function () {
         return res.status(404).send("Not found");
      })
      .once(Event.SUCCESS, function (resp) {
         return res.json(resp);
      });
};

// Gets single collaborators for a specific app
exports.removeCollaborator = function (req, res) {
   var appId = req.params.appId,
      collaboratorId = req.params.collaboratorId;

   HerokuService.removeCollaborator(appId, collaboratorId, req.user)
      .once(Event.ERROR, function (err) {
         return handleError(res, err);
      })
      .once(Event.NOT_FOUND, function () {
         return res.status(404).send("Not found");
      })
      .once(Event.SUCCESS, function (resp) {
         return res.json(resp);
      });
};

// creates a new collaborator
exports.createCollaborator = function (req, res) {
   var appId = req.params.appId,
      emailId = req.body.emailId;

   HerokuService.createCollaborator(appId, emailId, req.user)
      .once(Event.ERROR, function (err) {
         return handleError(res, err);
      })
      .once(Event.NOT_FOUND, function () {
         return res.status(404).send("Not found");
      })
      .once(Event.SUCCESS, function (resp) {
         return res.json(resp);
      });
};

// Gets the config variables for a specific app
exports.getConfig = function (req, res) {
   var appId = req.params.appId;

   var convertToArray = function (data, cb) {
      var items = [];
      async.forEachOf(data, function (val, key, iCB) {
         items.push({key: key, value: val});
         iCB();
      }, function () {
         cb(null, items);
      });
   };

   HerokuService.getConfig(appId, req.user)
      .once(Event.ERROR, function (err) {
         return handleError(res, err);
      })
      .once(Event.NOT_FOUND, function () {
         return res.status(404).send("Not found");
      })
      .once(Event.SUCCESS, function (resp) {
         console.log(resp);
         convertToArray(resp, function (err, data) {
            console.log(data);
            return res.json(data);
         })
      });
};

// Sets the config variables for a specific app
exports.setConfig = function (req, res) {
   var appId = req.params.appId,
      config = req.body.config;

   HerokuService.setConfigVar(appId, config, req.user)
      .once(Event.ERROR, function (err) {
         return handleError(res, err);
      })
      .once(Event.NOT_FOUND, function () {
         return res.status(404).send("Not found");
      })
      .once(Event.SUCCESS, function (resp) {
         return res.json(resp);
      });
};

// Removes the given config variables for a specific app
exports.removeConfig = function (req, res) {
   var appId = req.params.appId,
      config = req.body.config;

   HerokuService.removeConfigVar(appId, config, req.user)
      .once(Event.ERROR, function (err) {
         return handleError(res, err);
      })
      .once(Event.NOT_FOUND, function () {
         return res.status(404).send("Not found");
      })
      .once(Event.SUCCESS, function (resp) {
         return res.json(resp);
      });
};

//Gets a list of releases
exports.releases = function (req, res) {
   var appId = req.params.appId;

   var reverseOrder = function (data, cb) {
      var items = [];
      async.each(data, function (item, iCB) {
         items.unshift(item);
         iCB();
      }, function () {
         cb(null, items);
      })
   };

   HerokuService.releases(appId, req.user)
      .once(Event.ERROR, function (err) {
         return handleError(res, err);
      })
      .once(Event.NOT_FOUND, function () {
         return res.status(404).send("Not found");
      })
      .once(Event.SUCCESS, function (resp) {
         reverseOrder(resp, function (err, items) {
            return res.json(items);
         });
      });
};

//Rolls back to a release
exports.rollbackRelease = function (req, res) {
   var appId = req.params.appId,
      releaseId = req.params.releaseId;

   HerokuService.rollbackRelease(appId, releaseId, req.user)
      .once(Event.ERROR, function (err) {
         return handleError(res, err);
      })
      .once(Event.NOT_FOUND, function () {
         return res.status(404).send("Not found");
      })
      .once(Event.SUCCESS, function (resp) {
         return res.json(resp);
      });
};

function handleError(res, err) {
   return res.status(500).send(err);
}
