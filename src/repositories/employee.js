const { Employee } = require('../databases/models')
const BaseRepository = require('./index')

class EmployeeRepository extends BaseRepository {
  constructor() {
    super(Employee)
    this.model = Employee
  }

  async saveEmployeeModel(employee) {
    if (!employee || !(employee instanceof Employee)) throw new Error('employee required and must be an instance of Employee')

    console.log('employee updated')
    return await this.saveModel(employee)
  }
}

module.exports = EmployeeRepository
