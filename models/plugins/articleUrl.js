'use strict'

var url = require('url')
var mongoose = require('mongoose')

var Schema = mongoose.Schema

// Models
var Domain = require('../domain')

module.exports = exports = function deletedAtPlugin (schema, options) {
  schema.add({
    url: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    domain: {
      type: Schema.Types.ObjectId,
      ref: 'Domain'
    }
  })

  schema.pre('save', function (next) {
    if (!this.isModified('url')) return next()
    if (!this.url) return next()
  
    console.log('this.url', this.url)

    let urlObject = url.parse(this.url)
    this.url = urlObject.hostname && urlObject.href
    let hostname = urlObject.hostname && urlObject.hostname.replace(/^www./i, '')

    let domain = { hostname }
    Domain.findOrCreate(domain, domain, (err, domain) => {
      if (err) return next(err)      
      this.domain = domain._id
      next()
    })
  })

  if (options && options.index) {
    schema.path('url').index(options.index)
    schema.path('domain').index(options.index)
  }
}
