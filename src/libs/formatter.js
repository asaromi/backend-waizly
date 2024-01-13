require('dotenv').config()
const currentDialect = process.env.DB_DIALECT || 'mysql'

exports.generateTableInfo = (modelName, dialect = currentDialect) => {
  let snakeCase = modelName

  // if mysql replace "User" to "users" and "AttendanceTime" to "attendance_times"
  if (dialect === 'mysql') {
    const firstChar = snakeCase[0].toLowerCase()
    snakeCase = firstChar + snakeCase.slice(1).replace(/([A-Z])/g, (match) => {
      return '_' + match.toLowerCase()
    })
  }

  const lastChar = snakeCase[snakeCase.length - 1] === 'y' ? 'es' : 's'
  return {
    modelName,
    tableName: snakeCase + lastChar
  }
}
