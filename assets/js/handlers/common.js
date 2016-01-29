var $ = require('jquery')
var autosize = require('autosize')
var Dropzone = require('dropzone')
require('selectize')

Dropzone.autoDiscover = false

module.exports = function initCommonLibs () {
  // from a jQuery collection
  autosize($('textarea'))

  // Selectize
  $('select[name="hubs"]').selectize({
    create: false,
    maxItems: 3
  })

  initDropzone()
}

function initDropzone () {
  if (!$('#dropzone').length) return

  var dropzone = new Dropzone('div#dropzone', {
    addRemoveLinks: true,
    maxFiles: 10,
    maxFilesize: 2,
    parallelUploads: 5,
    acceptedFiles: 'image/*',
    url: '/files',
    dictDefaultMessage: 'Перетащите сюда файл с изображением',
    dictFallbackMessage: 'Ваш браузер не поддерживает загрузку картинок с помощью перетягивания',
    dictCancelUpload: 'Отменить',
    dictCancelUploadConfirmation: 'Точно отменить?',
    dictRemoveFile: 'Удалить'
    // dictMaxFilesExceeded: ''
  })

  dropzone.on('removedfile', function (file) {
    console.log('removedfile', dropzone.files)
  })

  dropzone.on('success', function (file, responseText) {
    console.log('success', dropzone.files)
  })
}
