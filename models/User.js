const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, 'Name Required'],
    minlength: 3,
    maxlenght: 30
  },
  email: {
    type: String,
    required: [true, 'Email Required'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Email Required'
    ], 
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password Required'],
    minlength: 6,
  }
})

UserSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.methods.createJWT = function () {
  return jwt.sign({userId: this._id, name: this.name}, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN
  })
}

UserSchema.methods.comparePassword = async function (loginPassword) {
  const isMatch = await bcrypt.compare(loginPassword, this.password)
  return isMatch
}
module.exports = mongoose.model('User', UserSchema)
