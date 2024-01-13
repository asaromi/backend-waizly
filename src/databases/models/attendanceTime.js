'use strict'
const {
  DataTypes: { STRING, DOUBLE },
  Model
} = require('sequelize')
const { generateTableInfo } = require('../../libs/formatter')
const generateId = require('../../libs/ulid')

module.exports = (sequelize, DataTypes) => {
  class AttendanceTime extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Attendance, {
        foreignKey: 'attendanceId',
        as: 'attendance'
      })
    }
  }

  AttendanceTime.init({
    id: {
      type: STRING(26),
      allowNull: false,
      primaryKey: true,
      defaultValue: generateId(),
    },
    employeeId: {
      type: STRING,
      allowNull: false,
    },
    attendanceId: {
      type: STRING,
      allowNull: false,
    },
    type: {
      type: STRING,
      allowNull: false,
    },
    ipAddress: {
      type: STRING,
      allowNull: true,
    },
    latitude: {
      type: DOUBLE,
      allowNull: false,
    },
    longitude: {
      type: DOUBLE,
      allowNull: false,
    },
    city: {
      type: STRING,
      allowNull: false,
    },
    region: {
      type: STRING,
      allowNull: false,
    },
    countryName: {
      type: STRING,
      allowNull: false,
    },
    countryCode: {
      type: STRING,
      allowNull: false,
    },
    utcOffset: {
      type: STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    ...generateTableInfo('AttendanceTime'),
    defaultScope: {
      attributes: {
        exclude: ['ipAddress']
      }
    }
  })
  return AttendanceTime
}
