import postRepository from '~/repositories/post.repository'
import { CreatePostDTO } from '~/dto/post/create-post.dto'
import { UpdatePostDTO } from '~/dto/post/update-post.dto'

class PostService {
  async getPosts() {
    return postRepository.findAll()
  }

  async getPost(id: string) {
    const post = await postRepository.findById(id)

    if (!post) {
      throw new Error('Post not found')
    }

    return post
  }

  async createPost(data: CreatePostDTO) {
    return postRepository.create(data)
  }

  async updatePost(id: string, data: UpdatePostDTO) {
    const post = await postRepository.update(id, data)

    if (!post) {
      throw new Error('Post not found')
    }

    return post
  }

  async deletePost(id: string) {
    const post = await postRepository.delete(id)

    if (!post) {
      throw new Error('Post not found')
    }

    return true
  }
}

export default new PostService()
