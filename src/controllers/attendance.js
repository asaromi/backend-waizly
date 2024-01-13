const { successResponse, errorResponse } = require('../libs/response')
const { getLocation } = require('../libs/ipApi')
const { Attendance, AttendanceTime } = require('../databases/models')
const AttendanceService = require('../services/attendance')
const AttendanceTimeService = require('../services/attendanceTime')
const { BadRequestError } = require('../libs/exceptions')

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

    if (!ipAddress) return errorResponse({ res, message: 'IP address is required', statusCode: 400 })
    const [location, countAttendance] = await Promise.all([
      getLocation(ipAddress),
      attendanceTimeService.countAttendanceTime({ query: { employeeId, type } })
    ])

    if (countAttendance > 0) {
      throw new BadRequestError(`You have already checked ${type} today`)
    }

    const date = attendanceService.todayDate(location.utcOffset)
    const attendance = await attendanceService.recordAttendance({
      date,
      type,
      employeeId,
      ipAddress,
      ...location
    })

    return successResponse({ res, result: attendance })
  } catch (error) {
    return errorResponse({ res, error })
  }
}

// const updateEmployeeAttendance = async (req, res) => {
//   try {
//     const { id: attendanceId } = req.params
//     const {
//
//     } = req.body
//     const attendance = await attendanceService.updateAttendanceById(attendanceId, body)
//   } catch (error) {
//
//   }
// }

module.exports = { getMyAttendances, postAttendance }
