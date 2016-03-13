'use strict';

var mongoose = require('mongoose'),
   Schema = mongoose.Schema;

var CacheSchema = new Schema({
   createdAt: {type: Date, expires: '30m', default: Date},
   type: {type: String},
   userToken: String,
   appId: String,
   data: {}
});

module.exports = mongoose.model('Cache', CacheSchema);
