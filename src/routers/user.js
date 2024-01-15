const { Router } = require('express')
const { getUserById, updateUserById } = require('../controllers/user')
const { authenticate, authorize } = require('../libs/middleware')
const { USER_ROLE } = require('../libs/constants')

const router = new Router()

router.use(authenticate)
router.get('/:id', getUserById)
router.patch('/:id', authorize(USER_ROLE.ADMIN), updateUserById)

module.exports = router
