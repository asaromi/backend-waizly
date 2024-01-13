'use strict'
const { EMPLOYMENT_TYPE } = require('../../libs/constants')
const { generateTableInfo } = require('../../libs/formatter')
const { tableName } = generateTableInfo('Employee')

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
        userId: {
          allowNull: false,
          type: Sequelize.STRING(26),
          references: {
            model: {
              tableName: 'users'
            },
            key: 'id'
          }
        },
        employmentType: {
          allowNull: false,
          type: Sequelize.ENUM(...Object.values(EMPLOYMENT_TYPE))
        },
        department: {
          allowNull: false,
          type: Sequelize.STRING
        },
        jobTitle: {
          allowNull: false,
          type: Sequelize.STRING
        },
        phoneNumber: {
          allowNull: true,
          type: Sequelize.STRING
        },
        salary: {
          allowNull: false,
          type: Sequelize.BIGINT.UNSIGNED
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

      await queryInterface.addIndex(tableName, ['userId', 'phoneNumber'], { transaction })
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
