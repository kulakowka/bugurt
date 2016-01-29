'use strict'

// Configs
var mongoose = require('../config/mongoose')
var path = require('path')

// File schema
var Schema = mongoose.Schema
var schema = Schema({
  filename: String,
  encoding: String,
  mimetype: String,
  destination: String,
  path: String,
  size: Number
}, { timestamps: { createdAt: 'createdAt' } })

// Model virtual attributes
schema.virtual('url').get(function () {
  return path.join('/files', this.id)
})

module.exports = mongoose.model('File', schema)
