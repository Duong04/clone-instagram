import PostModel from '~/models/post.model'
import { Post } from '~/types/post.type'

class PostRepository {
  async findAll() {
    return PostModel.find().lean()
  }

  async findById(id: string) {
    return PostModel.findById(id).lean()
  }

  async create(data: Partial<Post>) {
    return PostModel.create(data)
  }

  async update(id: string, data: Partial<Post>) {
    return PostModel.findByIdAndUpdate(id, data, { new: true })
  }

  async delete(id: string) {
    return PostModel.findByIdAndDelete(id)
  }
}

export default new PostRepository()
