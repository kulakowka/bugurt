'use strict'

const moment = require('moment')
const pluralize = require('pluralize-ru')

module.exports = function viewHelpers (req, res, next) {
  moment.locale('ru')
  // console.log('pjax:', req.get('X-PJAX'))
  // res.locals.pjax = req.get('X-PJAX')
  res.locals.subscribedToArticlesDigest = req.session.subscribedToArticlesDigest
  res.locals.env = process.env.NODE_ENV
  res.locals.moment = moment
  res.locals.currentUser = req.user
  res.locals.pluralize = pluralize
  next()
}
