const debug = require('debug')
const escapeStringRegexp = require('escape-string-regexp')
const User = require('lib/models').User
const utils = require('lib/utils')
const pluck = utils.pluck
const expose = utils.expose

const log = debug('democracyos:db-api:user')

const notifier = require('democracyos-notifier')

/**
 * Get all users
 *
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'users' list items found or `undefined`
 * @return {Module} `user` module
 * @api public
 */

exports.all = function all (fn) {
  log('Looking for all users.')

  User
    .find()
    .sort('-createdAt')
    .exec(function (err, users) {
      if (err) {
        log('Found error %j', err)
        return fn(err)
      }

      log('Delivering all users %j', pluck(users, 'id'))
      fn(null, users)
    })
  return this
}

/**
 * Get User for `id` string or `ObjectId`
 *
 * @param {String|ObjectId} id User's `id`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'user' single object created or `undefined`
 * @api public
 */

exports.get = function get (id, fn) {
  log('Looking for User %s', id)

  User
    .findById(id)
    .exec(function (err, user) {
      if (err) {
        log('Found error %j', err)
        return fn(err)
      }

      log('Delivering User %j', user)
      fn(null, user)
    })
  return this
}

/**
 * Search `User` objects from query
 *
 * @param {String} query string to search by `hash`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'users' list of `User` objects found or `undefined`
 * @return {Module} `user` module
 * @api public
 */

exports.search = function search (text, fn) {
  log('Searching for users matching %s', text)

  if (typeof text !== 'string') return fn(new Error('Invalid search term.'))

  if (text.length >= 256) return fn(new Error('Search term too long.'))

  let query = User.find().limit(10)

  if (text.includes('@')) {
    query = query.where({ email: text })
  } else {
    const searchTerm = escapeStringRegexp(text).replace(/\s+/g, '|')
    const regex = new RegExp(searchTerm, 'ig')

    query = query.or([
      { firstName: { $regex: regex } },
      { lastName: { $regex: regex } }
    ])
  }

  query.exec(function (err, users) {
    if (err) {
      log('Found error: %j', err)
      return fn(err)
    }

    log('Found users %j for text "%s"', users.length, text)
    fn(null, users)
  })

  return this
}

/**
 * Get `User` objects whose email has been validated
 *
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'users' list of `User` objects found or `undefined`
 * @return {Module} `user` module
 * @api public
 */

exports.findEmailValidated = function findEmailValidated (fn) {
  log('Searching for email validated users matching')

  User.find({ emailValidated: true })
    .exec(function (err, users) {
      if (err) {
        log('Found error: %j', err)
        return fn(err)
      }

      log('Found %d email validated users', users.length)
      fn(null, users)
    })

  return this
}

/**
 * Find `User` object by email
 *
 * @param {String} The email of the user
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'user' the `User` object found or `undefined`
 * @return {Module} `user` module
 * @api public
 */

exports.getByEmail = function search (email, fn) {
  log('Searching for User with email %s', email)

  User.findOne({ email: email })
    .select('firstName lastName fullName email avatar profilePictureUrl notifications emailValidated extra')
    .exec(function (err, user) {
      if (err) {
        log('Found error: %j', err)
        return fn(err)
      }

      if (!user) {
        log('User not found for email %s', email)
        return fn(null, false)
      }

      log('Found User %j for email %s', user.id, email)
      fn(null, user)
    })

  return this
}

/**
 * User interfaces functions.
 */

exports.expose = {}

/**
 * Expose user attributes to be used on a private manner.
 * e.g.: '/api/user/me' call from an authenticated user.
 *
 * @param {User} user.
 * @return {Hash} user attributes
 * @api public
 */

exports.expose.confidential = function exposeConfidential (user) {
  return expose(exports.expose.confidential.keys)(user)
}

exports.expose.confidential.keys = [
  'id',
  'firstName',
  'lastName',
  'displayName',
  'email',
  'avatar',
  'staff',
  'notifications',
  'locale',
  'privileges',
  'extra'
]

/**
 * Expose user attributes to be used publicly.
 * e.g.: Search calls, users listings.
 *
 * @param {User} user.
 * @return {Hash} user attributes
 * @api public
 */

exports.expose.ordinary = function exposeOrdinary (user) {
  return expose(exports.expose.ordinary.keys)(user)
}

exports.expose.ordinary.keys = [
  'id',
  'fullName',
  'displayName',
  'avatar',
  'badge',
  'locale',
  'extra'
]

////// HASTA ACÁ ERA EL ORIGINAL

exports.requestVerify = function requestVerify (id, fn) {
  log('Requesting verify for User %s', id)
  
  this.get(id, function (err, user) {
    let mailSubject = 'Consulta Pública - Solicitud de verificación de cuenta'
    let mailBodyHtml = `
      <p>El usuario <strong>${user.displayName}</strong>, con email <a href="mailto:${user.email}">${user.email}</a>, ha solicitado verificar su cuenta.</p>
      <p>Por favor, enviale alguna respuesta a su pedido.</p>
      <br />
      <p>Gracias, el sistema.</p>
    `
    // NOTA: el mailer puede enviar "bien" el mail pero el smtp server no, entonces nunca sale el mail y no nos enteramos
    // Eso solo se puede ver en los logs de smtp server
    
    notifier.mailer.send({
        to: 'wencha_@hotmail.com',
        subject: mailSubject,
        html: mailBodyHtml
      }).then(() => { 
        log('Notifier mailer send OK')
        fn(null, user)
      }).catch((err) => { 
        log('Notifier mailer send error: %j', err)
        fn(err)
      })
  })
  
  return this
}

exports.verifyUser = function verifyUser (id) {
  log('Verifying User with id %s', id)
  
  return new Promise((resolve, reject) => {
    User
      .findOneAndUpdate({_id : id}, { $set: { 'extra.verified': true } }, function (err, r) {
        if (err) {
          log('Verify User error: %s', err)
          return reject(err)
        }
        log('Verify User OK')
        resolve(1)
      })
  })
}