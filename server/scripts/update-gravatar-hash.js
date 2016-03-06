'use strict';

var User = require("../api/user/user.model"),
   crypto = require("crypto"),
   async = require("async");

exports.run = function (req, res) {
   var bulk = User.collection.initializeUnorderedBulkOp();

   User.find({emailHash: {$exists: false}}, {email: 1}).lean().exec(function (err, users) {
      if(err) {
         return console.log("Error fetching users.", err);
      }
      async.each(users, function (user, cb) {
         user.email = user.email && user.email.trim().toLowerCase() || "";
         var emailHash = crypto.createHash("md5").update(user.email).digest("hex");
         bulk.find({_id: user._id}).update({$set: {emailHash: emailHash}});
         cb();
      }, function () {
         console.log("Executing bulk update...");
         
         bulk.execute({}, function (err, resp) {
            console.log(err, resp);
            console.log("Finished update");
         });
      });
   });

   res.send("Updating email hashes for gravatar. Check console for more details.");
};