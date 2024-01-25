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
		tableName: snakeCase + lastChar,
	}
}

/**
 * @param {Object} params
 * @param {Date} params.date
 * @param {Object} params.options
 * @param {String} params.options.timezone default +0700. Format: "+07:00", "+0700", "-420", or -420
 * @param {String} params.options.format default YYYY-MM-DD
 */

exports.getTimestampDate = (params = {}) => {
	const { date: datetime, timezone = "+0700" } = params
	const today = datetime instanceof Date ? datetime : new Date(datetime || Date.now())
	const isMinuteTz = typeof timezone === 'number' || timezone.length < 5

	let minuteCounter = timezone
	let strOffset = timezone
	if (!isMinuteTz) {
		const hourOffset = parseInt(timezone.slice(0, 3)) * 60
		const minuteOffset = parseInt(timezone.slice(-2)) * (hourOffset < 0 ? -1 : 1)

		minuteCounter = -(hourOffset + minuteOffset)
	} else if (isMinuteTz) {
		strOffset = (parseInt(minuteCounter) < 0 ? '+' : '-')

		const hourOffset = Math.abs(parseInt(timezone) / 60)
		const fixedStringHour = Math.abs(hourOffset) < 10 ? '0' : ''
		strOffset += fixedStringHour + hourOffset

		const minuteOffset = parseInt(timezone) % 60
		const fixedStringMinute = Math.abs(minuteOffset) < 10 ? '0' : ''

		strOffset += `:${fixedStringMinute + minuteOffset}`
	}

	const current = today.getTime() - (minuteCounter * 60000)
	today.setUTCHours(0, 0, 0, 0)
	const startOfDay = today.getTime() - (minuteCounter * 6000)
	today.setUTCHours(23, 59, 59, 99)
	const endOfDay = today.getTime() - (minuteCounter * 6000)

	return { current, endOfDay, startOfDay, offset: { minute: minuteCounter, string: strOffset } }
}
