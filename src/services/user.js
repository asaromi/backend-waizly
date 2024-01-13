const { Employee, Op, User } = require('../databases/models')
const { USER_ROLE } = require('../libs/constants')
const generateId = require('../libs/ulid')
const UserRepository = require('../repositories/user')
const { ForbiddenError } = require('../libs/exceptions')

class UserService {
  constructor() {
    this.userRepository = new UserRepository()
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
  
  async getCountUserBy(query = {}) {
    if (query?.constructor !== Object) throw new Error('query must be an object')

    return await users
  }

  async saveUserModel(user) {
    if (!user || !(user instanceof User)) throw new Error('user required and must be an instance of User')

    return await this.userRepository.saveModel(user)
  }

  generateUserModel(data) {
    if (data?.constructor !== Object) throw new Error('data must be an object')
    else if (!data.id) data.id = generateId()

    return new User(data)
  }
}

module.exports = UserService
