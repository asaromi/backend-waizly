const { Attendance } = require('../databases/models')
const BaseRepository = require('./index')

class AttendanceRepository extends BaseRepository {
  constructor() {
    super(Attendance)
    this.model = Attendance
  }

  async getByOrCreate({ query, data: defaults, raw = true }) {
    return await this.model.findOrCreate({ where: query, defaults, raw })
  }
}

module.exports = AttendanceRepository
