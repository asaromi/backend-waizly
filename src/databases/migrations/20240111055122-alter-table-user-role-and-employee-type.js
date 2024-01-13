'use strict'

const { USER_ROLE, EMPLOYMENT_TYPE } = require('../../libs/constants')
const { generateTableInfo } = require('../../libs/formatter')
const { tableName: userTableName } = generateTableInfo('User')
const { tableName: employeeTableName } = generateTableInfo('Employee')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn(userTableName, 'role', {
        allowNull: false,
        type: Sequelize.ENUM(...Object.values(USER_ROLE)),
        defaultValue: USER_ROLE.USER,
        after: 'password'
      }, { transaction })

      await queryInterface.changeColumn(employeeTableName, 'employmentType', {
        type: Sequelize.ENUM(...Object.values(EMPLOYMENT_TYPE)),
        allowNull: false,
        defaultValue: EMPLOYMENT_TYPE.FULL_TIME,
      })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    const transaction = await queryInterface.sequelize.transaction()
    try {
      // check if it's exists before removeColumn
      const table = await queryInterface.describeTable(userTableName)
      if (table.role) {
        await queryInterface.removeColumn(userTableName, 'role', { transaction })
        await queryInterface.changeColumn(employeeTableName, 'employmentType', {
          type: Sequelize.ENUM(...Object.values(EMPLOYMENT_TYPE)),
          allowNull: false,
        }, { transaction })
      }

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}
