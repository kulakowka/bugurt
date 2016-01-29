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
schema.virtual('thumbnail').get(function () {
  return getCdnUrl(this, 100)
})

schema.virtual('big').get(function () {
  return getCdnUrl(this)
})

module.exports = mongoose.model('File', schema)

function getCdnUrl (file, width) {
  let ext = file.mimetype.split('/').pop()
  let url = `http://localhost:3000/files/${file.id}.${ext}`
  width = width || 1024
  if (process.env.NODE_ENV === 'production') return `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url=${url}&container=focus&refresh=2592000&resize_w=${width}`
  return url
}
