'use strict'
const { generateTableInfo } = require('../../libs/formatter')
const { tableName } = generateTableInfo('AttendanceTime')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.createTable(tableName, {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.STRING
        },
        attendanceId: {
          allowNull: false,
          type: Sequelize.STRING(26),
          references: {
            model: {
              tableName: generateTableInfo('Attendance').tableName
            },
            key: 'id'
          }
        },
        employeeId: {
          allowNull: false,
          type: Sequelize.STRING(26),
          references: {
            model: {
              tableName: generateTableInfo('Employee').tableName
            },
            key: 'id'
          },
        },
        type: {
          allowNull: false,
          type: Sequelize.STRING
        },
        ipAddress: {
          allowNull: true,
          type: Sequelize.STRING
        },
        latitude: {
          allowNull: false,
          type: Sequelize.DOUBLE
        },
        longitude: {
          allowNull: false,
          type: Sequelize.DOUBLE
        },
        city: {
          allowNull: false,
          type: Sequelize.STRING
        },
        region: {
          allowNull: false,
          type: Sequelize.STRING
        },
        countryName: {
          allowNull: false,
          type: Sequelize.STRING
        },
        countryCode: {
          allowNull: false,
          type: Sequelize.STRING
        },
        utcOffset: {
          allowNull: false,
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }, { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tableName)
  }
}
