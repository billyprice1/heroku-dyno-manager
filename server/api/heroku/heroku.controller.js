'use strict';

var HerokuService = require('./heroku.service'),
   Event = require("../../enum/event.enum");

// Get list of apps
exports.apps = function(req, res) {
   HerokuService.apps(null, null, req.user)
      .once(Event.ERROR, function(err) {
         return handleError(res, err);
      })
      .once(Event.NOT_FOUND, function() {
         return res.status(404).send("Not found");
      })
      .once(Event.SUCCESS, function(resp) {
         return res.json(resp);
      });
};

// Gets a list of dynos for a specific app
exports.dynos = function(req, res) {
   var appId = req.params.appId;
   HerokuService.dynos(appId, req.user)
      .once(Event.ERROR, function(err) {
         return handleError(res, err);
      })
      .once(Event.NOT_FOUND, function() {
         return res.status(404).send("Not found");
      })
      .once(Event.SUCCESS, function(resp) {
         return res.json(resp);
      });
};

// Restarts a given dyno.
exports.restart = function(req, res) {
   var appId = req.params.appId,
      dynoId = req.params.dynoId;

   HerokuService.restart(appId, dynoId, req.user)
      .once(Event.ERROR, function(err) {
         return handleError(res, err);
      })
      .once(Event.NOT_FOUND, function() {
         return res.status(404).send("Not found");
      })
      .once(Event.SUCCESS, function(resp) {
         return res.json(resp);
      });
};

// Gets a list of collaborators for a specific app
exports.listCollaborators = function(req, res) {
   var appId = req.params.appId;
   HerokuService.listCollaborators(appId, req.user)
      .once(Event.ERROR, function(err) {
         return handleError(res, err);
      })
      .once(Event.NOT_FOUND, function() {
         return res.status(404).send("Not found");
      })
      .once(Event.SUCCESS, function(resp) {
         return res.json(resp);
      });
};

// Gets single collaborators for a specific app
exports.getCollaborator = function(req, res) {
   var appId = req.params.appId,
      collaboratorId = req.params.collaboratorId;

   HerokuService.getCollaborator(appId, collaboratorId, req.user)
      .once(Event.ERROR, function(err) {
         return handleError(res, err);
      })
      .once(Event.NOT_FOUND, function() {
         return res.status(404).send("Not found");
      })
      .once(Event.SUCCESS, function(resp) {
         return res.json(resp);
      });
};

function handleError(res, err) {
   return res.status(500).send(err);
}
