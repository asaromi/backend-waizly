const { User } = require('../databases/models')
const BaseRepository = require('./index')

class UserRepository extends BaseRepository {
  constructor() {
    super(User)
    this.model = User
  }

  async storeData(data) {
    return await this.model.create(data)
  }

  async getBy({ query, options }) {
    return await this.model.findOne({
      where: query,
      ...options
    })
  }
}

module.exports = UserRepository
