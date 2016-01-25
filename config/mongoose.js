'use strict'

var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/bugurt_development', function () {
  console.log('Mongo connected')
})

module.exports = mongoose
