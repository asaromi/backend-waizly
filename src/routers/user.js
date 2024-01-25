const { Router } = require('express')
const { deleteUserById, getUsers, getUserById, updateUserById } = require('../controllers/user')
const { authenticate, authorize } = require('../libs/middleware')
const { USER_ROLE } = require('../libs/constants')

const router = new Router()

router.use(authenticate)
router.get('/:id', getUserById)
router.get('/', authorize(USER_ROLE.ADMIN), getUsers)
router.patch('/:id', authorize(USER_ROLE.ADMIN), updateUserById)
router.delete('/:id', authorize(USER_ROLE.ADMIN), deleteUserById)

module.exports = router
