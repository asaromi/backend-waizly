const generateId = require('../libs/ulid')
const EmployeeRepository = require('../repositories/employee')

class EmployeeService {
  constructor() {
    this.employeeRepository = new EmployeeRepository()
  }

  async saveEmployeeModel(employee) {
    return await this.employeeRepository.saveEmployeeModel(employee)
  }

  generateEmployeeModel(data) {
    if (data?.constructor !== Object) throw new Error('data must be an object')
    else if (!data.userId) throw new Error('userId is required')

    if (!data.id) data.id = generateId()

    return this.employeeRepository.generateModel(data)
  }
}

module.exports = EmployeeService
