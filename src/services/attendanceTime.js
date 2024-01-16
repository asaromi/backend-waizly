const AttendanceTimeRepository = require('../repositories/attendanceTime')
const { BadRequestError } = require('../libs/exceptions')

class AttendanceTimeService {
  constructor() {
    this.attendanceTimeRepository = new AttendanceTimeRepository()
  }

  async createAttendanceTime(data) {
    if (data?.constructor !== Object) throw new Error('data must be an object')
    else if (!data.employeeId || !data.attendanceId) throw new BadRequestError('employeeId is required')

    return await this.attendanceTimeRepository.storeData(data)
  }

  async countAttendanceTime({ query }) {
    return await this.attendanceTimeRepository.countData({ query })
  }

  async deleteAttendanceTimeByEmployeeId(employeeId, options = {}) {
    if (!employeeId) throw new BadRequestError('employeeId is required')

    return await this.attendanceTimeRepository.deleteData({ query: { employeeId }, options })
  }
}

module.exports = AttendanceTimeService
