const { Model } = require('sequelize')

class BaseRepository {
  constructor(model) {
    this.model = model || Model
  }

  async countData({ query }) {
    return await this.model.count({ where: query })
  }

  async deleteData({ query, options = {} }) {
    return await this.model.destroy({ where: query, ...options })
  }

  async deleteModel(model) {
    if (!model || !(model instanceof Model)) throw new Error('model required and must be an instance of Model')

    return await model.destroy()
  }

  async getBy({ query, options }) {
    return await this.model.findOne({ where: query, ...options })
  }

  async getPagination({ query, options = {} }) {
    const { limit = '10', page: currentPage = '1', ...where } = query
    const offset = limit * (parseInt(currentPage) - 1)

    const { count, rows } = await this.model.findAndCountAll({ where, ...options, limit: parseInt(limit), offset })
    return {
      data: rows,
      meta: {
        totalData: count,
        page: parseInt(currentPage),
        lastPage: Math.ceil(count / limit),
      }
    }
  }

  async storeData(data) {
    return await this.model.create(data)
  }

  async saveModel(data) {
    return data.save()
  }

  generateModel(data) {
    return new this.model(data)
  }
}

module.exports = BaseRepository
