const { Op } = require('../databases/models')
const { BadRequestError } = require('../libs/exceptions')
const { getLocation } = require('../libs/ipApi')
const { successResponse, errorResponse, debug } = require('../libs/response')
const AttendanceService = require('../services/attendance')
const AttendanceTimeService = require('../services/attendanceTime')

const attendanceService = new AttendanceService()
const attendanceTimeService = new AttendanceTimeService()

const getMyAttendances = async (req, res) => {
  try {
    const { employee: { id: employeeId } } = req.user
    const attendances = await attendanceService.getAttendancesByEmployeeId(employeeId)

    return successResponse({ res, result: attendances })
  } catch (error) {
    return errorResponse({ res, error })
  }
}

const postAttendance = async (req, res) => {
  try {
    const { employee: { id: employeeId } } = req.user
    const { body: { ipAddress }, params: { type } } = req

    if (!ipAddress) {
      throw new BadRequestError('ipAddress is required')
    }

    const location = await getLocation(ipAddress)
    const hourOffset = parseInt(location.utcOffset.slice(0, 3))
    const minuteOffset = parseInt((hourOffset > 0 ? '-' : '') + location.utcOffset.slice(-3))

    const starTimeUTC = new Date().setUTCHours(0, 0, 0, 0)
    const minDate = new Date(starTimeUTC - (hourOffset * 60 + minuteOffset) * 60000)
    const maxDate = new Date(minDate.getTime() + (23 * 3600000 + 59 * 60000 + 59 * 1000))
    const date = minDate.toISOString().slice(0, 10)

    const countQuery = { employeeId, type, timestamp: { [Op.between]: [minDate, maxDate] } }
    const countAttendance = await attendanceTimeService.countAttendanceTime({ query: countQuery })

    if (countAttendance > 0) {
      throw new BadRequestError(`You have already checked ${type} today`)
    }

    const attendance = await attendanceService.createOrFindAttendance({ employeeId, date })
    const attendanceTime = await attendanceTimeService.createAttendanceTime({
      employeeId,
      attendanceId: attendance.id,
      type,
      ipAddress,
      timestamp: new Date(),
      ...location
    })

    return successResponse({ res, result: { attendance, attendanceTime } })
  } catch (error) {
    return errorResponse({ res, error })
  }
}

module.exports = { getMyAttendances, postAttendance }
