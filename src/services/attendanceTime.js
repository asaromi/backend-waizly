const AttendanceTimeRepository = require('../repositories/attendanceTime')

class AttendanceTimeService {
  constructor() {
    this.attendanceTimeRepository = new AttendanceTimeRepository()
  }

  async countAttendanceTime({ query }) {
    return await this.attendanceTimeRepository.countData({ query })
  }


}

module.exports = AttendanceTimeService
