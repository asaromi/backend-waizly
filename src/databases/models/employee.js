'use strict';
const {
  DataTypes: { BIGINT, ENUM, STRING },
  Model
} = require('sequelize');
const { EMPLOYMENT_TYPE } = require('../../libs/constants')
const { generateTableInfo } = require('../../libs/formatter')
const generateId = require('../../libs/ulid')

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })

      this.hasMany(models.Attendance, {
        foreignKey: 'employeeId',
        as: 'attendances'
      })

      this.hasMany(models.AttendanceTime, {
        foreignKey: 'employeeId',
        as: 'attendanceTimes'
      })
    }
  }
  Employee.init({
    id: {
      type: STRING(26),
      allowNull: false,
      primaryKey: true,
      defaultValue: generateId(),
    },
    userId: {
      type: STRING(26),
      allowNull: false,
    },
    employmentType: {
      type: ENUM(...Object.values(EMPLOYMENT_TYPE)),
      allowNull: false,
      defaultValue: EMPLOYMENT_TYPE.FULL_TIME,
    },
    department: {
      type: STRING,
      allowNull: false,
    },
    jobTitle: {
      type: STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: STRING,
      allowNull: true,
    },
    salary: {
      type: BIGINT,
      allowNull: false,
    },
  }, {
    sequelize,
    ...generateTableInfo('Employee')
  });
  return Employee;
};
