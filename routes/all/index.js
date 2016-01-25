'use strict'

// Models
var SubscriptionUserToHub = require('../../models/subscriptionUserToHub')

// sidebar
module.exports = function loadSubscriptions (req, res, next) {
  if (!req.user) {
    res.locals.subscriptions = []
    return next()
  }

  SubscriptionUserToHub
  .find({creator: req.user._id})
  .sort('-createdAt')
  .populate('hub')
  .exec((err, subscriptions) => {
    if (err) return next(err)
    res.locals.subscriptions = subscriptions
    next()
  })
}
