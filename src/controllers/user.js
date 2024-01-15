const UserService = require('../services/user')
const { errorResponse, successResponse, debug } = require('../libs/response')
const { Model } = require('sequelize')
const { BadRequestError } = require('../libs/exceptions')

const userService = new UserService()

const updateAuthUser = async (req, res) => {
  try {
    let { user } = req

    const {
      name,
      email,
      password,
      phoneNumber,
      role,
      salary,
      employmentType,
      department,
      jobTitle
    } = req.body

    debug('employmentType', employmentType)

    if (!(user instanceof Model)) {
      throw new Error('user must be an instance of sequelize model')
    } else if (
      (!name && !password && !email && role) &&
      (!phoneNumber && !salary && !employmentType && !department && !jobTitle)
    ) {
      throw new Error('required minimum 1 field to update')
    }

    const updatedUser = await userService.updateUserModel({
      user,
      name,
      phoneNumber,
      password,
      role,
      salary,
      employmentType,
      department,
      jobTitle
    })

    return successResponse({ res, result: updatedUser })
  } catch (error) {
    return errorResponse({ res, error })
  }
}

const getUserById = async (req, res) => {
  try {
    const { id } = req.params
    const user = await userService.getUserById(id)
    return successResponse({ res, result: user })
  } catch (error) {
    return errorResponse({ res, error })
  }
}

const updateUserById = async (req, res) => {
  try {
    const { params: { id } } = req
    const {
      email,
      name,
      phoneNumber,
      password,
      role,
      salary,
      employmentType,
      department,
      jobTitle
    } = req.body

    if (
      (!name && !password && !email && !role) &&
      (!phoneNumber && !salary && !employmentType && !department && !jobTitle)
    ) {
      throw new Error('required minimum 1 field to update')
    }

    const user = await userService.getUserById(id, { isMiddleware: true })
    const updateUser = await userService.updateUserModel({
      user,
      name,
      phoneNumber,
      password,
      role,
      salary,
      employmentType,
      department,
      jobTitle
    })

    return successResponse({ res, result: updateUser })
  } catch (error) {
    return errorResponse({ res, error })
  }
}

module.exports = { getUserById, updateAuthUser, updateUserById }
