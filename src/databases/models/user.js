'use strict'
const {
  DataTypes: { ENUM, STRING, TEXT },
  Model,
} = require('sequelize')
const { USER_ROLE } = require('../../libs/constants')
const { generateTableInfo } = require('../../libs/formatter')
const generateId = require('../../libs/ulid')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models = { Model }) {
      // define association here
      this.hasOne(models.Employee, {
        foreignKey: 'userId',
        as: 'employee'
      })
    }
  }

  User.init({
    id: {
      type: STRING(26),
      allowNull: false,
      primaryKey: true,
      defaultValue: generateId(),
    },
    name: {
      type: STRING,
      allowNull: false,
    },
    email: {
      type: STRING,
      allowNull: false,
    },
    password: {
      type: TEXT,
      allowNull: false,
    },
    role: {
      allowNull: false,
      type: ENUM(...Object.values(USER_ROLE)),
      defaultValue: USER_ROLE.USER
    },
  }, {
    sequelize,
    ...generateTableInfo('User'),
    defaultScope: {
      attributes: {
        exclude: ['password']
      }
    },
  })

  return User
}
