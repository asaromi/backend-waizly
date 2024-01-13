const { Model } = require('sequelize')

class BaseRepository {
  constructor(model) {
    this.model = model || Model
  }

  async getPagination({ limit: pageLimit = '10', page = '1', query, options = {} }) {
    const limit = parseInt(page)
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

  async saveModel(data) {
    return data.save()
  }

  generateModel(data) {
    return new this.model(data)
  }
}

module.exports = BaseRepository
