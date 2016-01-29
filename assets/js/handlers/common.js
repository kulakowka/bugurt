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
    var res = JSON.parse(file.xhr.responseText)
    var id = res.shift()._id
    var form = $(dropzone.element).closest('form')
    var input = form.find('input[value="' + id + '"]')
    input.remove()
    console.log('removedfile', id, input)
  })

  dropzone.on('success', function (file, responseText) {
    var res = JSON.parse(file.xhr.responseText)
    var id = res.shift()._id
    var form = $(dropzone.element).closest('form')
    var input = $('<input type="hidden" name="file">')
    input.val(id)
    form.append(input)
    console.log('success', id)
  })
}
