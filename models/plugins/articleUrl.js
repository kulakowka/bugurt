'use strict'

var url = require('url')

module.exports = exports = function deletedAtPlugin (schema, options) {
  schema.add({
    url: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    hostname: {
      lowercase: true,
      type: String,
      trim: true
    }
  })

  schema.pre('save', function (next) {
    if (!this.isModified('url')) return next()
    let urlObject = url.parse(this.url)
    this.url = urlObject.hostname && urlObject.href
    this.hostname = urlObject.hostname && urlObject.hostname.replace(/^www./i, '')
    next()
  })

  if (options && options.index) {
    schema.path('url').index(options.index)
    schema.path('hostname').index(options.index)
  }
}
