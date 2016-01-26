'use strict'

var $ = require('jquery')
var autosize = require('autosize')

module.exports.onFormSubmit = function onFormSubmit (event) {
  var form = $(this)
  var data = form.serialize()
  var commentsList = $('.commentsList')
  var textarea = form.find('textarea').get(0)

  $.post('/comments', data).done(function (html) {
    commentsList.append(html)
  }).fail(function (html) {
    console.log('error')
  })

  form.trigger('reset')
  autosize.update(textarea)

  return false
}
