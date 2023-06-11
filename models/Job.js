const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Please provide company name'],
    maxlength: 100
  },
  status: {
    type: String, 
    enum: ['interview', 'declined', 'pending'],
    default: 'pending'
  },
  position: {
    type: String,
    required: [true, 'Please provide position'],
    maxlength: 100
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please Provide User']
  }
  },
  {timestamps: true}
  )

  module.exports = mongoose.model('Job', JobSchema)