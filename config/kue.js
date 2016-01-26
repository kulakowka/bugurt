const kue = require('kue')
const GetEmailTemplateService = require('../services/emails/getTemplate')
const mailgunSend = require('./mailgun').mailgunSend
const maxActiveJobs = 20

// Disable events on objects for better job performance
var Queue = kue.createQueue({
  jobEvents: false
})

module.exports.Queue = Queue

// Start queue
Queue.process('email', maxActiveJobs, processEmail)

/**
 * The function is called for each job in the queue
 */
function processEmail (job, done) {
  GetEmailTemplateService(job.data)
  .then(result => {
    var data = getData(job, result)
    console.log('send email', data)
    mailgunSend(data, done)
  })
  .catch(done)
}

/**
 * The function generates and returns a specially formatted object required to be sent to mailGun
 */
function getData (job, result) {
  return {
    from: 'Bugurt.ru <no-reply@bugurt.ru>',
    to: job.data.user.email,
    subject: job.data.title,
    html: result.html
  }
}

