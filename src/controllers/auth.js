const { Model } = require('sequelize')
const { comparePassword, hashPassword } = require('../libs/bcrypt')
const { errorResponse, successResponse } = require('../libs/response')
const { AuthError, NotFoundError } = require('../libs/exceptions')
const { generateToken, verifyToken } = require('../libs/jwt')
const EmployeeService = require('../services/employee')
const UserService = require('../services/user')
const { USER_ROLE } = require('../libs/constants')

const userService = new UserService()
const employeeService = new EmployeeService()

const login = async (req, res) => {
  try {
    const { email, password: purePassword } = req.body

    const user = await userService.getUserByEmail(email, { isAuth: true })
    if (!user) throw new NotFoundError('User not found')

    const isPasswordCorrect = await comparePassword(purePassword, user.password)
    if (!isPasswordCorrect) throw new AuthError('Wrong password')

    const token = await generateToken({ id: user.id })

    const { password, ...userWithoutPassword } = user instanceof Model ? user.toJSON() : user
    return successResponse({ res, result: { user: userWithoutPassword, token } })
  } catch (error) {
    return errorResponse({ res, error })
  }
}

const register = async (req, res) => {
  try {
    const {
      department,
      email,
      employmentType,
      jobTitle,
      name,
      password: purePassword,
      phoneNumber,
      salary = 2000000
    } = req.body

    const password = await hashPassword(purePassword)
    const userModel = userService.generateUserModel({
      email,
      password,
      name
    })

    const employeeModel = employeeService.generateEmployeeModel({
      userId: userModel.id,
      department,
      employmentType,
      jobTitle,
      phoneNumber,
      salary
    })

    await userService.saveUserModel(userModel)
    await employeeService.saveEmployeeModel(employeeModel)

    const token = await generateToken({ id: userModel.id })
    return successResponse({ res, result: { user: userModel.toJSON(), token } })
  } catch (error) {
    return errorResponse({ res, error })
  }
}

const loginAdmin = async (req, res) => {
  try {
    const { email, password: purePassword } = req.body

    const user = await userService.getAdminByEmail(email, { isAuth: true })
    if (!user) throw new NotFoundError('User not found')

    const isPasswordCorrect = await comparePassword(purePassword, user.password)
    if (!isPasswordCorrect) throw new AuthError('Wrong password')

    const token = await generateToken({ id: user.id })

    const { password, ...userWithoutPassword } = user instanceof Model ? user.toJSON() : user
    return successResponse({ res, result: { user: userWithoutPassword, token } })
  } catch (error) {
    return errorResponse({ res, error })
  }
}

const registerAdmin = async (req, res) => {
  try {
    const {
      email,
      name,
      password: purePassword,
    } = req.body

    const password = await hashPassword(purePassword)
    const user = await userService.storeUser({ name, email, password, type: USER_ROLE.ADMIN })
    const token = await generateToken({ id: user.id })

    return successResponse({ res, result: { user: user.toJSON(), token } })
  } catch (error) {
    return errorResponse({ res, error })
  }
}

const getAuthUser = async (req, res) => {
  try {
    const { user } = req

    return successResponse({ res, result: user })
  } catch (error) {
    return errorResponse({ res, error })
  }
}

module.exports = { getAuthUser, login, loginAdmin, register, registerAdmin }
