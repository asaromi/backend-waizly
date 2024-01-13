"use strict"

const { Sequelize, DataTypes, Op } = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('../config')[env]
const db = {}

const payload = []
if (config.use_env_variable) {
  payload.push(process.env[config.use_env_variable], config)
} else {
  payload.push(config.database, config.username, config.password, config)
}
const sequelize = new Sequelize(...payload)
const User = require("./user")(sequelize, DataTypes)
const Employee = require("./employee")(sequelize, DataTypes)
const Attendance = require("./attendance")(sequelize, DataTypes)
const AttendanceTime = require("./attendanceTime")(sequelize, DataTypes)

db.User = User
db.Employee = Employee
db.Attendance = Attendance
db.AttendanceTime = AttendanceTime

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize
db.Op = Op

module.exports = db
