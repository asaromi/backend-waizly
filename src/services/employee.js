const { Employee } = require('../databases/models')
const generateId = require('../libs/ulid')

class EmployeeService {
  async #getEmployeeBy({ query, options = {} }) {
    if (query?.constructor !== Object) throw new Error('query must be an object')
    else if (query && options) options.where = query

    return await Employee.findOne(options)
  }

  async storeEmployee(payload) {
    return await Employee.create(payload)
  }

  async getEmployeeById(id, options = {}) {
    if (!id) throw new Error('id is required')

    const query = { id }
    return await this.#getEmployeeBy({ query, options })
  }

  generateEmployeeModel(data) {
    if (data?.constructor !== Object) throw new Error('data must be an object')
    else if (!data.userId) throw new Error('userId is required')

    if (!data.id) data.id = generateId()

    return new Employee(data)
  }

  async saveEmployeeModel(employee) {
    if (!employee || !(employee instanceof Employee)) throw new Error('employee required and must be an instance of Employee')

    return await employee.save()
  }
}

module.exports = EmployeeService
