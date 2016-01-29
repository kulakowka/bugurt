var $ = require('jquery')

module.exports.show = function (event) {
  var link = $(this)
  var url = link.attr('href')
  var next = link.next('.lightbox')
  var overlay = $('<div class="lightboxOverlay">')
  var preview = $('<img class="lightboxPreview">')
  preview.attr('src', url)
  overlay.append(preview)
  $('body').append(overlay)

  overlay.on('click', function () {
    overlay.remove()
    return false
  })

  preview.on('click', function () {
    overlay.remove()
    next.click()
    return false
  })
  return false
}
