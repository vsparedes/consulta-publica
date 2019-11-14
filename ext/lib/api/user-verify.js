const debug = require('debug')
const log = debug('democracyos:ext:api:user-verify')
const express = require('express')

const validate = require('lib/api-v2/validate')
const middlewares = require('lib/api-v2/middlewares')
var privileges = require('lib/privileges/forum')
var utils = require('lib/utils')
var expose = utils.expose
var restrict = utils.restrict
var models = require('lib/models')
var User = models.User

const api = require('../db-api')

const app = module.exports = express.Router()

app.post('/:id',
middlewares.users.restrict,
function requestUserVerify(req, res, next) {
  let verifyId = req.params.id
  let fromId = req.user._id
  
  if (fromId != verifyId)
    next(new Error('Can\'t request user verify for another user'))
  
  log('Sending user verify request for id %s', verifyId)
  
  api.user.requestVerify(verifyId, function (err, user) {
    if(err) next(err)
    log('User verify request sent successfully for id %s', user.id)
    return res.status(200).json({
      status: 200,
      results: {
        user: user
      }
    })
  })
})