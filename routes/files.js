'use strict'

// Packages
var express = require('express')
var router = express.Router()
var multer = require('multer')
var path = require('path')
var fs = require('fs-extra')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = path.join('uploads', req.user.id, 'articles')
    fs.ensureDir(dir, (err, dirr) => {
      if (err) return cb(err)
      cb(null, dir)
    })
  }
})

var upload = multer({
  storage,
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
var File = require('../models/file')

// Policies
var ifUser = require('./policies/ifUser')

// Error responses
const getNotFoundError = require('./errors/notFound')

// POST /files
router.post('/', ifUser, upload.array('file', 10), (req, res, next) => {
  File.create(req.files, (err, result) => {
    if (err) return next(err)
    res.json(result)
  })
})

// GET /files/:id
router.get('/:id', (req, res, next) => {
  File.findById(req.params.id, (err, file) => {
    if (err) return next(err)
    if (!file) return next(getNotFoundError('File not found'))
    res.setHeader('content-type', file.mimetype)
    fs.createReadStream(file.path).pipe(res)
  })
})

module.exports = router
