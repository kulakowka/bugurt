'use strict'

// Packages
var express = require('express')
var router = express.Router()

// Models
var Article = require('../models/article')

// Policies
const ifUser = require('./policies/ifUser')

// GET /
router.get('/', (req, res, next) => {
  var query = {}
  var options = {
    // select:   'title date author',
    sort: { createdAt: -1 },
    populate: 'domain hubs creator',
    // lean: true,
    offset: req.query.offset || 0,
    limit: 30
  }

  Article.paginate(query, options).then(result => {
    res.render('articles/index', result)
  }).catch(next)
})

// GET /feed
router.get('/feed', ifUser, (req, res, next) => {
  let subscriptions = res.locals.subscriptions
  let hubs = subscriptions.map(subscription => subscription.hub)

  var query = {hubs: {$in: hubs}}
  var options = {
    // select:   'title date author',
    sort: { createdAt: -1 },
    populate: 'domain hubs creator',
    // lean: true,
    offset: req.query.offset || 0,
    limit: 30
  }

  Article.paginate(query, options).then(result => {
    res.render('articles/feed', result)
  }).catch(next)
})

module.exports = router
