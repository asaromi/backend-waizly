const { AuthError, ForbiddenError } = require('./exceptions')
const { verifyToken } = require('./jwt')
const { errorResponse, debug } = require('./response')
const UserService = require('../services/user')

const userService = new UserService()

const authenticate = async (req, res, next) => {
  try {
    const { authorization } = req.headers
    if (!authorization) throw new AuthError('Token not found')

    const [type, token] = authorization.split(' ')
    const { id } =  type === 'Bearer' && await verifyToken(token) || {}

    const user = await userService.getUserById(id, { isMiddleware: true })
    if (!user) throw new AuthError('User not found')

    req.user = user
    if(next) next()
  } catch (error) {
    return errorResponse({ res, error })
  }
}

const authorize = (...roles) =>
  (req, res, next) => {
    try {
      const { user } = req
      if (!user) throw new AuthError('Unauthorized')

      debug(user.role)
      if (roles.length && !roles.includes(user.role)) {
        throw new ForbiddenError('Forbidden Access')
      }

      next()
    } catch (error) {
      return errorResponse({ res, error })
    }
  }

module.exports = { authenticate, authorize }
