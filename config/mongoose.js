'use strict'

var mongoose = require('mongoose')
require('mongoose-paginater')

mongoose.connect('mongodb://localhost/bugurt_development', function () {
  console.log('Mongo connected')
})

module.exports = mongoose
