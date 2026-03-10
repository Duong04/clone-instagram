import mongoose, { Schema } from 'mongoose'
import { User } from '~/types/user.type'

const PostSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model<User>('User', PostSchema)
