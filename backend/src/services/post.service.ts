import postRepository from '~/repositories/post.repository'
import type { CreatePostDto, UpdatePostDto } from '~/dto/post'

class PostService {
  async getAll(limit: number, cursor?: string) {
    return postRepository.all(limit, cursor)
  }

  async getById(id: string) {
    const post = await postRepository.find(id)

    if (!post) {
      throw new Error('Bài viết không tồn tại')
    }

    return post
  }

  async create(userId: string, data: CreatePostDto) {
    const { media_ids, ...rest } = data

    return postRepository.create({
      ...rest,
      user: {
        connect: { id: userId }
      },
      media: {
        create: media_ids.map((mediaId, index) => ({
          position: index,
          media: {
            connect: { id: mediaId }
          }
        }))
      }
    })
  }

  async update(id: string, data: UpdatePostDto, userId: string) {
    const post = await this.getById(id)
    if (post.user_id !== userId) {
      throw new Error('You do not have permission to edit this post.')
    }

    return postRepository.update(
      {
        caption: data.caption,
        location: data.location,
        comments_disabled: data.comments_disabled
      },
      id
    )
  }

  async remove(id: string, userId: string) {
    const post = await this.getById(id)
    if (post.user_id !== userId) {
      throw new Error('You do not have the right to delete this post.')
    }

    return postRepository.softDelete(id)
  }
}

export default new PostService()
