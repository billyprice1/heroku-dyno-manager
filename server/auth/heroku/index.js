'use strict';

var express = require('express'),
   HerokuService = require("../../api/heroku/heroku.service"),
   Event = require("../../enum/event.enum"),
   auth = require('../auth.service');

var router = express.Router();

router.get("/callback", function(req, res, next) {
   var code = req.query.code,
      state = req.query.state;

   HerokuService.authorize(code)
      .once(Event.ERROR, function(err) {
         return handleError(res, err);
      })
      .once(Event.SUCCESS, function(resp) {
         res.redirect("/");
      });
});

function handleError(res, err) {
   return res.status(500).send(err);
}

module.exports = router;
