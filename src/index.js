require('dotenv').config()
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const { errorResponse, successResponse } = require('./libs/response')
const { NotFoundError } = require('./libs/exceptions')

const app = express()
const logType = process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'

const { HOST = 'localhost', PORT } = process.env
const listenParams = [PORT]
if (HOST) listenParams.push(HOST)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('tiny'))

app.get('/', (req, res) => {
  return successResponse({ res, result: "Hello World" })
})

app.use('/api', require('./routers'))
app.use((req, res) => {
  const error = new NotFoundError(`Endpoint ${req.method} ${req.originalUrl} not found`)
  return errorResponse({ res, error })
})

app.listen(...listenParams, () => {
  console.info(`Server listen on ${HOST}:${PORT}`)
})
