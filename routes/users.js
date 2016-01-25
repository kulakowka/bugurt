'use strict'

// Packages
const express = require('express')
const router = express.Router()

// Models
const SubscriptionUserToHub = require('../models/subscriptionUserToHub')
const User = require('../models/user')
const Comment = require('../models/comment')
const Article = require('../models/article')
const Hub = require('../models/hub')

// Error responses
const getNotFoundError = require('./errors/notFound')

// GET /users
router.get('/', (req, res, next) => {
  var query = {}
  var options = {
    // select:   'title date author',
    sort: { createdAt: -1 },
    // populate: 'creator',
    // lean: true,
    offset: req.query.offset || 0,
    limit: 30
  }

  User.paginate(query, options).then(result => {
    res.render('users/index', result)
  }).catch(next)
})

// GET /users/:username
router.get('/:username', loadUser, (req, res, next) => {
  res.render('users/show')
})

// GET /users/:username/articles
router.get('/:username/articles', loadUser, (req, res, next) => {
  const user = res.locals.user
  var query = {creator: user._id}
  var options = {
    // select:   'title date author',
    sort: { createdAt: -1 },
    populate: 'domain hubs creator',
    // lean: true,
    offset: req.query.offset || 0,
    limit: 30
  }

  Article.paginate(query, options).then(result => {
    res.render('users/articles/index', result)
  }).catch(next)
})

// GET /users/:username/hubs
router.get('/:username/hubs', loadUser, loadSubscriptions, (req, res, next) => {
  const subscriptions = res.locals.subscriptions || []
  const subscribedHubsIds = subscriptions.map(subscription => subscription.hub.toString())
  const user = res.locals.user

  var query = {creator: user._id}
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
      const id = hub._id.toString()
      return subscribedHubsIds.indexOf(id) !== -1
    }
    res.render('users/hubs/index', result)
  }).catch(next)
})

// GET /users/:username/comments
router.get('/:username/comments', loadUser, (req, res, next) => {
  const user = res.locals.user
  var query = {creator: user._id}
  var options = {
    // select:   'title date author',
    sort: { createdAt: -1 },
    populate: 'article creator',
    // lean: true,
    offset: req.query.offset || 0,
    limit: 30
  }

  Comment.paginate(query, options).then(result => {
    res.render('users/comments/index', result)
  }).catch(next)
})

module.exports = router

// Middlewares for this router

function loadUser (req, res, next) {
  User
  .findOne({username: req.params.username})
  .exec((err, user) => {
    if (err) return next(err)
    if (!user) return next(getNotFoundError('User not found'))

    res.locals.user = user
    next()
  })
}

function loadSubscriptions (req, res, next) {
  if (!req.user) return next()

  SubscriptionUserToHub
  .find({creator: req.user._id})
  .exec((err, subscriptions) => {
    if (err) return next(err)
    res.locals.subscriptions = subscriptions
    next()
  })
}
