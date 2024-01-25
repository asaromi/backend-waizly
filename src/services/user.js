const { Model } = require('sequelize')
const EmployeeService = require('./employee')
const { Employee, Op, User, sequelize } = require('../databases/models')
const { hashPassword } = require('../libs/bcrypt')
const { USER_ROLE } = require('../libs/constants')
const { BadRequestError, NotFoundError } = require('../libs/exceptions')
const { debug } = require('../libs/response')
const generateId = require('../libs/ulid')
const UserRepository = require('../repositories/user')

class UserService {
  constructor() {
    this.userRepository = new UserRepository()
    this.employeeService = new EmployeeService()
  }

  // updated with sequelize concept
  async #getUserBy({ query, options }) {
    if (query?.constructor !== Object) throw new Error('query must be an object')
    else if (query && options) options.where = { ...query }

    const newOptions = this.#generateAuthAttributes(options)
    return await this.userRepository.getBy({ options: newOptions })
  }

  #generateAuthAttributes(options = {}) {
    const { isAuth, isMiddleware, attributes = [], include = [] } = options

    if (isAuth || isMiddleware) {
      options.include = [...include, {
        model: Employee,
        as: 'employee',
      }]
    }

    if (isAuth) {
      options.attributes = {
        include: [...new Set([...attributes, 'password'])],
        exclude: ['role']
      }
    } else if (isMiddleware) {
      options.attributes = {
        include: [...new Set([...attributes, 'role'])],
        exclude: ['password']
      }
    }

    return options
  }

  // updated with sequelize concept
  async storeUser(data) {
    if (data?.constructor !== Object) throw new Error('data must be an object')

    return await this.userRepository.storeData(data)
  }

  async getUserById(id, options = {}) {
    if (!id) throw new Error('id is required')

    const query = { id }
    return await this.#getUserBy({ query, options })
  }

  async getUserByEmail(email, options = {}) {
    if (!email) throw new Error('email is required')

    const query = { email, role: USER_ROLE.USER }
    const [user, isExistsEmail] = await Promise.all([
      this.#getUserBy({ query, options }),
      this.getCountUserBy({ email, role: { [Op.ne]: USER_ROLE.USER } })
    ])

    if (isExistsEmail && !user) throw new Error('Wrong access, your role is not user')

    return user
  }

  async getAdminByEmail(email, options = {}) {
    if (!email) throw new Error('email is required')

    const query = { email, role: USER_ROLE.ADMIN }
    const [user, isExistsEmail] = await Promise.all([
      this.#getUserBy({ query, options }),
      this.getCountUserBy({ email, role: { [Op.ne]: USER_ROLE.ADMIN } })
    ])

    if (isExistsEmail && !user) throw new Error('Wrong access, your role is not admin')

    return user
  }
  
  async getCountUserBy(query) {
    if (query?.constructor !== Object) throw new Error('query must be an object')

    return await this.userRepository.countData({ query })
  }

  async saveUserModel(user) {
    if (!user || !(user instanceof User)) throw new Error('user required and must be an instance of User')

    return await this.userRepository.saveModel(user)
  }

  async updateUserModel({ user, ...data }) {
    if (data?.constructor !== Object) throw new Error('data must be an object')

    const updatePromises = []
    const { employee } = user
    if (!(user instanceof User) && !(user instanceof Model)) {
      throw new Error('user must be an instance of User')
    }

    const {
      name,
      password,
      email,
      phoneNumber,
      salary,
      employmentType,
      department,
      jobTitle
    } = data

    user.name = name || user.name
    user.email = email || user.email
    user.phoneNumber = phoneNumber || user.phoneNumber
    updatePromises.push(this.saveUserModel(user))

    if (employee instanceof Employee) {
      debug('employee will be updated')
      employee.phoneNumber = phoneNumber || employee.phoneNumber
      employee.salary = salary || employee.salary
      employee.employmentType = employmentType || employee.employmentType
      employee.department = department || employee.department
      employee.jobTitle = jobTitle || employee.jobTitle

      updatePromises.push(this.employeeService.saveEmployeeModel(employee))
      user.emplyee = employee
    }

    if (password) {
      user.password = await hashPassword(password)
      updatePromises.push(this.saveUserModel(user))
    }

    await Promise.all(updatePromises)

    return user.toJSON()
  }

  async deleteUserBy({ query = {}, options }) {
    if (query?.constructor !== Object) throw new Error('query must be an object')

    debug('try deleting user with query', query)
    const user = await this.#getUserBy({
      query,
      options: {
        include: {
          model: Employee, as: 'employee'
        },
        ...options
      },
    })

    if (!user || !(user instanceof User)) throw new NotFoundError('User not found')

    debug('user found!', user.toJSON())
    let deleted = {}
    if (user.employee) {
      const deletedEmployee = await this.employeeService.deleteEmployeeModel(user.employee)
      if (!deletedEmployee) throw new BadRequestError('Failed to delete employee')

      deleted = { ...deletedEmployee }
    }

    deleted.user = await this.userRepository.deleteModel(user)
    debug('user deleted!', deleted.user)
    return deleted
  }

  async getPaginationUsers({ query, options }) {
    if (query?.constructor !== Object) throw new Error('query must be an object')

    const newOptions = this.#generateAuthAttributes(options)
    return await this.userRepository.getPagination({ query, options: newOptions })
  }

  generateUserModel(data) {
    if (data?.constructor !== Object) throw new Error('data must be an object')
    else if (!data.id) data.id = generateId()

    return this.userRepository.generateModel(data)
  }
}

module.exports = UserService
