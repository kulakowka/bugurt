'use strict'

// Configs
var mongoose = require('../config/mongoose')

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

module.exports = mongoose.model('File', schema)
