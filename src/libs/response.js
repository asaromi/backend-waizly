require('dotenv').config()

const debug = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args)
  }
}

const successResponse = ({ message, res, result, statusCode = 200 }) => {
  debug(statusCode, result)
  return res.status(statusCode).json({
    success: true,
    result,
    message
  })
}

const errorResponse = ({ error, res, statusCode = 500 }) => {
  debug(error)
  const { message, statusCode: code } = error

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
