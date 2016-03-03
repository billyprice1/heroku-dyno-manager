var passport = require('passport');
var UserService = require("../../api/user/user.service");
var Event = require("../../enum/event.enum");
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (User, config) {
   passport.use(new LocalStrategy({
         usernameField: 'email',
         passwordField: 'password' // this is the virtual field on the model
      },
      function (email, password, done) {
         User.findOne({
            email: email.toLowerCase()
         }, function (err, user) {
            if (err) return done(err);

            if (!user) {
               //get a new token and register this user
               UserService.login(email, password)
                  .once(Event.ERROR, function (err) {
                     return done(err);
                  })
                  .once(Event.UNAUTHORIZED, function () {
                     return done(null, false, {message: 'User is not registered. Invalid credentials.'});
                  })
                  .once(Event.SUCCESS, function (user) {
                     return done(null, user);
                  });
            } else if (!user.authenticate(password)) {
               return done(null, false, {message: 'This password is not correct.'});
            } else {
               return done(null, user);
            }
         });
      }
   ));
};