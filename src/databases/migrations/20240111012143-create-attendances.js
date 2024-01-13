'use strict'
const { generateTableInfo } = require('../../libs/formatter')
const { tableName } = generateTableInfo('Attendance')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.createTable(tableName, {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.STRING(26)
        },
        date: {
          allowNull: false,
          type: Sequelize.DATEONLY
        },
        employeeId: {
          allowNull: false,
          type: Sequelize.STRING(26),
          references: {
            model: {
              tableName: 'employees'
            },
            key: 'id'
          }
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

      await queryInterface.addIndex('attendances', ['employeeId'], { transaction })
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
