const { Router } = require('express')
const { login, register, loginAdmin, registerAdmin, getAuthUser } = require('../controllers/auth')
const { authenticate } = require('../libs/middleware')
const router = new Router()

router.post('/login', login)
router.post('/register', register)
router.post('/login/admin', loginAdmin)
router.post('/register/admin', registerAdmin)
router.get('/', authenticate, getAuthUser)

module.exports = router
