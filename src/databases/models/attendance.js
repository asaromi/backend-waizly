'use strict'
const {
  DataTypes: { DATEONLY, STRING },
  Model
} = require('sequelize')
const { generateTableInfo } = require('../../libs/formatter')
const generateId = require('../../libs/ulid')

module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models = { Model }) {
      // define association here
      this.belongsTo(models.Employee, {
        foreignKey: 'employeeId',
        as: 'employee'
      })

      this.hasMany(models.AttendanceTime, {
        foreignKey: 'attendanceId',
        as: 'attendanceTimes'
      })
    }
  }

  Attendance.init({
    id: {
      type: STRING(26),
      allowNull: false,
      primaryKey: true,
      defaultValue: generateId(),
    },
    date: {
      type: DATEONLY,
      allowNull: false,
    },
    employeeId: {
      type: STRING(26),
      allowNull: false,
    },
  }, {
    sequelize,
    ...generateTableInfo('Attendance')
  })
  return Attendance
}
