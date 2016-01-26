'use strict'

// Packages
var express = require('express')
var router = express.Router()
var sm = require('sitemap')

// Models
var Article = require('../models/article')

// GET /sitemap
router.get('/articles.xml', (req, res, next) => {
  Article
    .find({isDeleted: {$ne: true}})
    .populate({
      path: 'creator',
      select: 'username'
    })
    .limit(1000)
    .sort({createdAt: -1})
    .exec((err, articles) => {
      if (err) return next(err)

      sm.createSitemap({
        hostname: 'http://bugurt.ru',
        cacheTime: 600000,  // 600 sec (10 min) cache purge period
        urls: articles.map(mapArticle)
      }).toXML((err, xml) => {
        if (err) return next(err)
        res.header('Content-Type', 'application/xml')
        res.send(xml)
      })
    })
})

module.exports = router

function mapArticle (article) {
  return {
    url: '/articles/' + article._id + '/' + article.slug,
    changefreq: 'weekly',
    lastmod: article.updatedAt
  }
}
