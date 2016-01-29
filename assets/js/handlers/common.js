var $ = require('jquery')
var autosize = require('autosize')
var Dropzone = require('dropzone')
require('selectize')

module.exports = function initCommonLibs () {
  // from a jQuery collection
  autosize($('textarea'))

  // Selectize
  $('select[name="hubs"]').selectize({
    create: false,
    maxItems: 3
  })

  Dropzone.autoDiscover = false

  var myDropzone = new Dropzone('div#dropzone', {
    maxFiles: 10,
    maxFilesize: 2,
    parallelUploads: 5,
    acceptedFiles: 'image/*',
    url: '/upload/image',
    dictDefaultMessage: 'Перетащите сюда файл с изображением',
    dictFallbackMessage: 'Ваш браузер не поддерживает загрузку картинок с помощью перетягивания',
    // dictMaxFilesExceeded: ''
  })
}
