const generateId = require('../libs/ulid')
const AttendanceService = require('./attendance')
const EmployeeRepository = require('../repositories/employee')
const { BadRequestError } = require('../libs/exceptions')
const { debug } = require('../libs/response')

class EmployeeService {
  constructor() {
    this.employeeRepository = new EmployeeRepository()
    this.attendanceService = new AttendanceService()
  }

  async deleteEmployeeModel(employee) {
    const deleted = await this.attendanceService.deleteAttendanceByEmployeeId(employee.id) || {}
    if (!deleted) throw new BadRequestError('Failed to delete attendance or attendance with employeeId not found')

    deleted.employee = await this.employeeRepository.deleteModel(employee)
    if (!deleted.employee) throw new BadRequestError('Failed to delete employee')
    debug('employee deleted!', deleted.employee)

    return deleted
  }

  async getEmployeeByUserId(userId, options = {}) {
    if (!userId) throw new BadRequestError('userId is required')

    const query = { userId }
    return await this.employeeRepository.getBy({ query, options })
  }

  async saveEmployeeModel(employee) {
    return await this.employeeRepository.saveModel(employee)
  }

  generateEmployeeModel(data) {
    if (data?.constructor !== Object) throw new Error('data must be an object')
    else if (!data.userId) throw new BadRequestError('userId is required')

    if (!data.id) data.id = generateId()

    return this.employeeRepository.generateModel(data)
  }
}

module.exports = EmployeeService
