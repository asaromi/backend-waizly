const { Model } = require('sequelize')
const { Employee, Op, User } = require('../databases/models')
const { hashPassword } = require('../libs/bcrypt')
const { USER_ROLE } = require('../libs/constants')
const { debug } = require('../libs/response')
const generateId = require('../libs/ulid')
const UserRepository = require('../repositories/user')
const EmployeeRepository = require('../repositories/employee')

class UserService {
  constructor() {
    this.userRepository = new UserRepository()
    this.employeeRepository = new EmployeeRepository()
  }

  // updated with sequelize concept
  async #getUserBy({ query, options }) {
    if (query?.constructor !== Object) throw new Error('query must be an object')
    else if (query && options) options.where = query

    const newOptions = this.#generateAuthAttributes(options)
    return await this.userRepository.getBy({ options: newOptions })
  }

  #generateAuthAttributes(options = {}) {
    const { isAuth, isMiddleware, attributes = [], include = [], ...restOptions } = options

    if (isAuth || isMiddleware) {
      restOptions.include = [...include, {
        model: Employee,
        as: 'employee',
      }]
    }

    if (isAuth) {
      restOptions.attributes = {
        include: [...new Set([...attributes, 'password'])],
        exclude: ['role']
      }
    } else if (isMiddleware) {
      restOptions.attributes = {
        include: [...new Set([...attributes, 'role'])],
        exclude: ['password']
      }
    }

    return restOptions
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

  generateUserModel(data) {
    if (data?.constructor !== Object) throw new Error('data must be an object')
    else if (!data.id) data.id = generateId()

    return this.userRepository.generateModel(data)
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

      updatePromises.push(this.employeeRepository.saveEmployeeModel(employee))
      user.emplyee = employee
    }

    if (password) {
      user.password = await hashPassword(password)
      updatePromises.push(this.saveUserModel(user))
    }

    await Promise.all(updatePromises)

    return user.toJSON()
  }
}

module.exports = UserService
