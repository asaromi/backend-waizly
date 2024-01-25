const { User } = require('../databases/models')
const BaseRepository = require('./index')

class UserRepository extends BaseRepository {
  constructor() {
    super(User)
    this.model = User
  }
}

module.exports = UserRepository
