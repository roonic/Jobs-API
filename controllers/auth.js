const { StatusCodes } = require('http-status-codes')
const User = require('../models/User')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  const {name, email, password} = req.body

  // if (!name || !email || !password) {
  //   throw new BadRequestError('Require Name, Email and Password')
  // }
  // try {
  const user = await User.create({...req.body})
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ user:{name: user.name}, token })
  // }
  // catch(error) {
  //   console.log(error)
  // }
}
const login = async (req, res) => {
  const {email, password} = req.body

  if (!email || !password) {
    throw new BadRequestError('Email and Password Required!')
  }
  
  const user = await User.findOne({email})

  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  const passwordCorrect =  await user.comparePassword(password)
  if (!passwordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({user:{name: user.name}, token})
}


module.exports = {
  register,
  login
}