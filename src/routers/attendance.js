const { Router } = require('express')
const { getMyAttendances, postAttendance } = require('../controllers/attendance')
const { authenticate, authorize } = require('../libs/middleware')
const { USER_ROLE } = require('../libs/constants')
const router = new Router()

router.use(authenticate)
router.get('/', getMyAttendances)
router.post('/check-:type(in|out)', postAttendance)
// router.put('/attendances/:id', authenticate, authorize([USER_ROLE.ADMIN]), updateAttendance)

module.exports = router
