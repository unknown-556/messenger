import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  profilePic: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'male', 'female'],
    required: true
  }
},
{
  timestamps: true
}
);

const User = mongoose.model('User',userSchema)
export default User