'use strict';

var HerokuService = require('./heroku.service'),
   Event = require("../../enum/event.enum"),
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
   HerokuService.listCollaborators(appId, req.user)
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

   HerokuService.getConfig(appId, req.user)
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

function handleError(res, err) {
   return res.status(500).send(err);
}
