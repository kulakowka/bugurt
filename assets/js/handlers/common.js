var $ = require('jquery')
var autosize = require('autosize')
require('selectize')

module.exports = function initCommonLibs () {
  // from a jQuery collection
  autosize($('textarea'))

  // Selectize
  $('select[name="hubs"]').selectize({
    create: false,
    maxItems: 3
  })
}
