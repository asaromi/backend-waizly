const { Model } = require('sequelize')
const { Employee } = require('../databases/models')
const { errorResponse, successResponse, debug } = require('../libs/response')
const UserService = require('../services/user')

const userService = new UserService()

const getUsers = async (req, res) => {
  try {
    const options = {
      include: {
        model: Employee,
        as: 'employee',
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      }
    }

    const users = await userService.getPaginationUsers({ query: req.query, options })
    return successResponse({ res, result: users })
  } catch (error) {
    return errorResponse({ res, error })
  }
}

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
    const options = {
      include: {
        model: Employee,
        as: 'employee',
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      }
    }

    const user = await userService.getUserById(id, options)
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

const deleteUserById = async (req, res) => {
  try {
    const { params: { id } } = req

    const deleted = await userService.deleteUserBy({ query: { id } })
    if (!deleted?.user || !deleted) throw new Error('Failed to delete user')

    return successResponse({ res, result: { userId: id, deleted } })
  } catch (error) {
    return errorResponse({ res, error })
  }
}

module.exports = { deleteUserById, getUserById, getUsers, updateAuthUser, updateUserById }
