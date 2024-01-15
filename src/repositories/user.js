const { User } = require('../databases/models')
const BaseRepository = require('./index')

class UserRepository extends BaseRepository {
  constructor() {
    super(User)
    this.model = User
  }

  async updateBy({ query, data, options = {} }) {
    return await this.model.update({ ...data }, { where: query, ...options })
  }
}

module.exports = UserRepository
