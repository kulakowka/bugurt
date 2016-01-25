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
  var query = {domain: domain._id}
  var options = {
    // select:   'title date author',
    sort: { createdAt: -1 },
    populate: 'domain hubs creator',
    // lean: true,
    offset: req.query.offset || 0,
    limit: 30
  }

  Article.paginate(query, options).then(result => {
    res.render('domains/show', result)
  }).catch(next)
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
