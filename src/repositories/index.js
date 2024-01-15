const { Model } = require('sequelize')

class BaseRepository {
  constructor(model) {
    this.model = model || Model
  }

  async storeData(data) {
    return await this.model.create(data)
  }

  async getBy({ query, options }) {
    return await this.model.findOne({ where: query, ...options })
  }

  async saveModel(data) {
    return data.save()
  }

  async getPagination({ limit: pageLimit = '10', page = '1', query, options = {} }) {
    const limit = parseInt(pageLimit)
    const offset = limit * (parseInt(page) - 1)
    const { count, rows } = await this.model.findAndCountAll({ where: query, ...options, limit: parseInt(limit), offset })
    return {
      data: rows,
      meta: {
        totalData: count,
        page,
        lastPage: Math.ceil(count / limit),
      }
    }
  }

  async countData({ query }) {
    return await this.model.count({ where: query })
  }

  async updateData({ query, data }) {
    return await this.model.update(data, { where: query })
  }

  async deleteData({ query }) {
    return await this.model.destroy({ where: query })
  }

  generateModel(data) {
    return new this.model(data)
  }
}

module.exports = BaseRepository
