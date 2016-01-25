'use strict'

// Packages
var express = require('express')
var router = express.Router()

// Models
var Article = require('../models/article')
var Hub = require('../models/hub')
var SubscriptionUserToHub = require('../models/subscriptionUserToHub')

// Policies
var ifUser = require('./policies/ifUser')

// Error responses
const getForbiddenError = require('./errors/forbidden')
const getNotFoundError = require('./errors/notFound')

// GET /hubs
router.get('/', (req, res, next) => {
  let subscriptions = res.locals.subscriptions || []
  let subscribedHubsIds = subscriptions.map(subscription => subscription.hub._id.toString())

  var query = {}
  var options = {
    // select:   'title date author',
    sort: { createdAt: -1 },
    populate: 'creator',
    // lean: true,
    offset: req.query.offset || 0,
    limit: 30
  }

  Hub.paginate(query, options).then(result => {
    res.locals.isSubscribed = (hub) => {
      let id = hub._id.toString()
      return subscribedHubsIds.indexOf(id) !== -1
    }
    res.render('hubs/index', result)
  }).catch(next)
})

// GET /hubs/new
router.get('/new', ifUser, (req, res, next) => {
  res.render('hubs/new', {hub: {}})
})

// GET /hubs/:slug/edit
router.get('/:slug/edit', ifUser, loadHub, ifCanEdit, (req, res, next) => {
  res.render('hubs/edit')
})

// GET /hubs/:slug
router.get('/:slug', loadHub, loadSubscription, (req, res, next) => {
  let hub = res.locals.hub

  var query = {hubs: { $in: [hub._id] }}
  var options = {
    // select:   'title date author',
    sort: { createdAt: -1 },
    populate: 'domain hubs creator',
    // lean: true,
    offset: req.query.offset || 0,
    limit: 30
  }

  res.locals.isSubscribed = (hub) => !!res.locals.subscription

  Article.paginate(query, options).then(result => {
    res.render('hubs/show', result)
  }).catch(next)
})

// GET /hubs/:slug/subscribers
router.get('/:slug/subscribers', loadHub, loadSubscription, (req, res, next) => {
  let hub = res.locals.hub
  var query = {hub: hub._id}
  var options = {
    // select:   'title date author',
    sort: { createdAt: -1 },
    populate: 'creator',
    // lean: true,
    offset: req.query.offset || 0,
    limit: 30
  }

  res.locals.isSubscribed = (hub) => !!res.locals.subscription

  SubscriptionUserToHub.paginate(query, options).then(result => {
    result.docs = result.docs.map(subscription => subscription.creator)
    res.render('hubs/subscribers', result)
  }).catch(next)
})

// PUT /hubs/:slug
router.put('/:slug', ifUser, loadHub, ifCanEdit, (req, res, next) => {
  let hub = res.locals.hub

  Object.assign(hub, {
    title: req.body.title,
    description: req.body.description
  })

  hub.save((err) => {
    if (err) return next(err)
    res.redirect('/hubs/' + hub.slug)
  })
})

// POST /hubs
router.post('/', (req, res, next) => {
  var hub = new Hub({
    title: req.body.title,
    description: req.body.description,
    creator: req.user._id
  })

  hub.save((err) => {
    if (err) return next(err)
    res.redirect('/hubs/' + hub.slug)
  })
})

module.exports = router

// Middlewares for this router

function loadHub (req, res, next) {
  Hub
  .findOne({slug: req.params.slug})
  .populate('creator')
  .exec((err, hub) => {
    if (err) return next(err)
    if (!hub) return next(getNotFoundError('Hub not found'))
    res.locals.hub = hub
    next()
  })
}

function loadSubscription (req, res, next) {
  if (!req.user) return next()
  let hub = res.locals.hub

  SubscriptionUserToHub
  .findOne({creator: req.user._id, hub: hub._id})
  .exec((err, subscription) => {
    if (err) return next(err)
    res.locals.subscription = subscription
    next()
  })
}

function ifCanEdit (req, res, next) {
  let hub = res.locals.hub
  if (!req.user.can('edit', hub)) return next(getForbiddenError())
  next()
}
