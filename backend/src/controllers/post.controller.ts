import { Request, Response } from 'express'
import postService from '~/services/post.service'
import { createPostSchema } from '~/dto/post/create-post.dto'
import { updatePostSchema } from '~/dto/post/update-post.dto'

class PostController {
  async index(req: Request<{ id: string }>, res: Response) {
    const posts = await postService.getPosts()

    res.json({
      success: true,
      data: posts
    })
  }

  async show(req: Request<{ id: string }>, res: Response) {
    const post = await postService.getPost(req.params.id)

    res.json({
      success: true,
      data: post
    })
  }

  async store(req: Request, res: Response) {
    const body = createPostSchema.parse(req.body)

    const post = await postService.createPost(body)

    res.status(201).json({
      success: true,
      data: post
    })
  }

  async update(req: Request<{ id: string }>, res: Response) {
    const body = updatePostSchema.parse(req.body)

    const post = await postService.updatePost(req.params.id, body)

    res.json({
      success: true,
      data: post
    })
  }

  async destroy(req: Request<{ id: string }>, res: Response) {
    await postService.deletePost(req.params.id)

    res.json({
      success: true,
      message: 'Post deleted'
    })
  }
}

export default new PostController()
