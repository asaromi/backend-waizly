const { AttendanceTime } = require('../databases/models')
const BaseRepository = require('./index')

class AttendanceTimeRepository extends BaseRepository {
  constructor() {
    super(AttendanceTime)
  }
}

module.exports = AttendanceTimeRepository
