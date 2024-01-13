const { Employee } = require('../databases/models')
const BaseRepository = require('./index')

class EmployeeRepository extends BaseRepository {
  constructor() {
    super(Employee)
  }
}

module.exports = EmployeeRepository
