'use strict';

var mongoose = require('mongoose'),
   Schema = mongoose.Schema;

var HerokuSchema = new Schema({
   accessToken: String,
   expires: Number,
   refreshToken: String
});

module.exports = mongoose.model('Heroku', HerokuSchema);
