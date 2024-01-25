require('dotenv').config()

const debug = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args)
  }
}

const debugError = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(...args)
  }
}

const successResponse = ({ message, res, result, statusCode = 200 }) => {
  return res.status(statusCode).json({
    success: true,
    result,
    message
  })
}

const errorResponse = ({ error, res, statusCode = 500 }) => {
  debugError(statusCode, error)
  const { message, statusCode: code } = error || {}

  return res.status(code || statusCode).json({
    success: false,
    message: message || error
  })
}

module.exports = {
  debug,
  errorResponse,
  successResponse,
}
