'use strict'

// Configs
var mongoose = require('../config/mongoose')

// VerificationTokenSchema schema
var Schema = mongoose.Schema
var schema = Schema({
  hostname: {
    type: String,
    required: true,
    index: true,
    lowercase: true,
    trim: true
  },
  articlesCount: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

schema.statics.findOrCreate = function (condition, params, callback) {
  return this.model('Domain').findOne(condition, (err, domain) => {
    if (err) return callback(err)
    if (domain) return callback(null, domain)

    this.model('Domain').create(params, callback)
  })
}

module.exports = mongoose.model('Domain', schema)
