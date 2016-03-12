'use strict';

var express = require('express'),
   auth = require("../../auth/auth.service"),
   controller = require('./heroku.controller');

var router = express.Router();

router.post('/', auth.isAuthenticated(), controller.apps);
router.post('/dynos/:appId', auth.isAuthenticated(), controller.dynos);
router.post('/restart/:appId/:dynoId', auth.isAuthenticated(), controller.restart);

router.post("/collaborators/:appId", auth.isAuthenticated(), controller.listCollaborators);

module.exports = router;
