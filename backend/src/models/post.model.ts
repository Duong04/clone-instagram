import mongoose, { Schema } from 'mongoose'
import { Post } from '~/types/post.type'

const PostSchema = new Schema<Post>(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    author_id: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model<Post>('Post', PostSchema)
