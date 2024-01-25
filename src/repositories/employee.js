const { Employee } = require('../databases/models')
const BaseRepository = require('./index')

class EmployeeRepository extends BaseRepository {
  constructor() {
    super(Employee)
    this.model = Employee
  }
}

module.exports = EmployeeRepository
