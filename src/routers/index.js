const { Router } = require('express')
const router = new Router()

router.use('/auth', require('./auth'))
router.use('/attendances', require('./attendance'))
router.use('/users', require('./user'))

module.exports = router
