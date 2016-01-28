var $ = require('jquery')
var attachFastClick = require('fastclick')
var Pjax = require('pjax')

// Fast click
attachFastClick(document.body)

// Configure pjax
new Pjax({
  // elements: 'a[href]',
  analytics: function () {
    window.ga('send', 'pageview', {page: document.location.pathname, title: document.title})
  }
})

// Handlers
var comment = require('./handlers/comment')
var article = require('./handlers/article')
var hub = require('./handlers/hub')
var subscription = require('./handlers/subscription')
var auth = require('./handlers/auth')
var dropdown = require('./handlers/dropdown')
var common = require('./handlers/common')

// run common when page first loaded
common()

$(document)

  // pjax
  .on('pjax:success', common)

  // dropdown
  .on('click', '.dropdown .handle', dropdown.onHandleClick)

  // hubs
  .on('click', '.js-hub-subscribe', hub.onSubscribeClick)
  .on('click', '.js-hub-unsubscribe', hub.onUnsubscribeClick)

  // comments
  .on('submit', '.commentForm', comment.onFormSubmit)

  // articles
  .on('submit', '.articleForm', article.onFormSubmit)

  // sidebar: subscription
  .on('submit', '.subscriptionForm', subscription.onFormSubmit)

  // users
  .on('click', '.js-button-logout', auth.logout)
  .on('submit', '.js-form-signin', auth.signin)
  .on('submit', '.js-form-signup', auth.signup)
  .on('submit', '.js-form-user-update', auth.userUpdate)
  .on('submit', '.js-form-user-destroy', auth.userDestroy)

  
