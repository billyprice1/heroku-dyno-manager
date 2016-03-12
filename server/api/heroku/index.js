'use strict';

var express = require('express'),
   auth = require("../../auth/auth.service"),
   controller = require('./heroku.controller');

var router = express.Router();

router.post('/', auth.isAuthenticated(), controller.apps);
router.post('/dynos/:appId', auth.isAuthenticated(), controller.dynos);
router.post('/restart/:appId/:dynoId', auth.isAuthenticated(), controller.restart);

router.post("/config/list/:appId", auth.isAuthenticated(), controller.getConfig);
router.post("/config/create/:appId", auth.isAuthenticated(), controller.setConfig);

router.post("/collaborators/list/:appId", auth.isAuthenticated(), controller.listCollaborators);
router.post("/collaborators/create/:appId", auth.isAuthenticated(), controller.createCollaborator);
router.post("/collaborators/show/:appId/:collaboratorId", auth.isAuthenticated(), controller.getCollaborator);
router.post("/collaborators/remove/:appId/:collaboratorId", auth.isAuthenticated(), controller.removeCollaborator);

module.exports = router;
