const { Attendance, AttendanceTime } = require('../databases/models')
const { ATTENDANCE_TYPE } = require('../libs/constants')
const { debug } = require('../libs/response')
const AttendanceRepository = require('../repositories/attendance')
const AttendanceTimeService = require('./attendanceTime')
const { BadRequestError } = require('../libs/exceptions')

class AttendanceService {
  constructor() {
    this.attendanceRepository = new AttendanceRepository()
    this.attendanceTimeService = new AttendanceTimeService()
  }

  async createOrFindAttendance(data) {
    if (data?.constructor !== Object) throw new Error('data must be an object')

    const { type, ...payload } = data
    const date = this.todayDate(data.utcOffset)

    const query = { date, employeeId: payload.employeeId }
    const [attendance,] = await this.attendanceRepository.getByOrCreate({ query, data: query })

    return attendance
  }

  async getAttendancesByEmployeeId(employeeId, options = {}) {
    if (!employeeId) throw new BadRequestError('employeeId is required')

    const query = { employeeId }
    const newOptions = {
      ...options,
      include: [
        {
          model: AttendanceTime,
          as: 'attendanceTimes',
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }
      ],
      sort: [
        ['date', 'DESC'],
        ['attendanceTimes', 'timestamp', 'DESC']
      ]
    }

    return await this.attendanceRepository.getPagination({ query, options: newOptions })
  }

  async deleteAttendanceByEmployeeId(employeeId, options = {}) {
    try {
      if (!employeeId) throw new BadRequestError('id is required')

      const attendanceTime = await this.attendanceTimeService.deleteAttendanceTimeByEmployeeId(employeeId, options)
      debug('attendanceTime deleted!', attendanceTime)

      const attendance = await this.attendanceRepository.deleteData({ query: { employeeId }, options })
      debug('attendance deleted!', attendance)

      return { attendance, attendanceTime }
    } catch (error) {
      throw error
    }
  }

  todayDate(timezoneOffset = "+0700") {
    const date = new Date()
    debug('before: ', date.toISOString())
    const hourOffset = parseInt(timezoneOffset.slice(0, 3))
    const minuteOffset = parseInt(timezoneOffset.slice(3)) * (hourOffset < 0 ? -1 : 1)

    date.setUTCHours(date.getUTCHours() + hourOffset)
    date.setUTCMinutes(date.getUTCMinutes() + minuteOffset)

    debug('after: ', date.toISOString())
    return date.toISOString().slice(0, 10)
  }
}

module.exports = AttendanceService
