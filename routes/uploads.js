'use strict'

// Packages
var express = require('express')
var router = express.Router()
var multer = require('multer')
var upload = multer({
  dest: 'uploads/',
  fileFilter: function (req, file, cb) {
    let accept = /image\/*/.test(file.mimetype)
    cb(null, accept)
  },
  limits: {
    files: 10,
    fileSize: 2097152
  }
})

// Models
var Article = require('../models/article')
var Domain = require('../models/domain')

// Policies
var ifUser = require('./policies/ifUser')

// Error responses
const getForbiddenError = require('./errors/forbidden')
const getNotFoundError = require('./errors/notFound')

// POST /upload/image
router.post('/image', ifUser, upload.array('file', 10), (req, res, next) => {
  res.json(req.files)
})

module.exports = router
