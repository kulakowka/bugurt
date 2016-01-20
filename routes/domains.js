'use strict'

// Packages
var express = require('express')
var router = express.Router()

// Models
var Article = require('../models/article')
var Domain = require('../models/domain')


// Policies
var ifUser = require('./policies/ifUser')

// Error responses
const getForbiddenError = require('./errors/forbidden')
const getNotFoundError = require('./errors/notFound')

// GET /domains/:hostname
router.get('/:hostname', loadDomain, (req, res, next) => {
  let domain = res.locals.domain
  var options = {
    perPage: 10,
    delta: 3,
    page: req.query.page
  }

  Article
  .find({domain: domain._id})
  .populate('hubs')
  .populate('domain')
  .populate('creator')
  .sort('-createdAt')
  .paginater(options, (err, data) => {
    if (err) return next(err)
    res.render('domains/show', data)
  })
})

module.exports = router

// Middlewares for this router

function loadDomain (req, res, next) {
  Domain
  .findOne({hostname: req.params.hostname})
  .exec((err, domain) => {
    if (err) return next(err)
    if (!domain) return next(getNotFoundError('Domain not found'))
    res.locals.domain = domain
    next()
  })
}
