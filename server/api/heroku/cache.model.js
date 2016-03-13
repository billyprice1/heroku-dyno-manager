'use strict';

var mongoose = require('mongoose'),
   CacheEnum = require("../../enum/cache.enum"),
   Schema = mongoose.Schema;

var CacheSchema = new Schema({
   createdAt: {type: Date, expires: '30m', default: Date},
   type: {type: String, enum: CacheEnum.list, default: CacheEnum.types.APPS},
   userToken: String,
   appId: String,
   data: {}
});

CacheSchema.index({appId: 1, type: 1});
CacheSchema.index({userToken: 1, type: 1});

module.exports = mongoose.model('Cache', CacheSchema);
