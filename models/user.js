const { model, Schema } = require('mongoose')

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name must not be empty'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Name must not be empty'],
      validate: {
        validator: (email) => emailRegex.test(email),
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    role: {
      type: String,
      required: [true, 'Name must not be empty'],
      enum: ['user', 'admin', 'superadmin'],
    },
  },
  { timestamps: true }
)

const User = model('User', userSchema)

module.exports = User
