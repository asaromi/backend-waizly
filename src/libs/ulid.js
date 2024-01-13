const { monotonicFactory } = require('ulidx')

const ulid = monotonicFactory()
const generateULID = (now = Date.now()) => ulid(now).toLowerCase()

module.exports = generateULID
