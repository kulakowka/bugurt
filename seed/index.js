#!/usr/bin/env node --harmony

'use strict'

var program = require('commander')

program
  .option('-U, --users [count]', 'Seed [count] users', 10)
  .option('-S, --subscriptions [count]', 'Seed [count] subscriptions', 10)
  .option('-H, --hubs [count]', 'Seed [count] hubs', 10)
  .option('-C, --comments [count]', 'Seed [count] comments', 10)
  .option('-A, --articles [count]', 'Seed [count] articles', 10)
  .parse(process.argv)

var async = require('async')
var colors = require('colors')
var mongoose = require('../config/mongoose')

var articles = require('./articles')(program.articles)
var hubs = require('./hubs')(program.hubs)
var users = require('./users')(program.users)
var comments = require('./comments')(program.comments)
var subscriptions = require('./subscriptions')(program.subscriptions)
var reporter = require('./reporter')

mongoose.connection.once('open', function () {
  console.log(colors.red('Mongo connection opened'))
  mongoose.connection.db.dropDatabase(function () {
    console.log(colors.red('\nDatabase dropped!'))
    async.series({users, hubs, articles, comments, subscriptions}, reporter)
  })
})
