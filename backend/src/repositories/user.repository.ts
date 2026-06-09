import { prisma } from '~/config/database'
import type { Prisma } from '~/generated/prisma/client'

class UserRepository {
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        avatar: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
            reels: true
          }
        }
      }
    })

    if (!user) return null

    return {
      ...user,
      _count: {
        ...user._count,
        total_content: user._count.posts + user._count.reels
      }
    }
  }

  async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username }
    })
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    const user = await prisma.user.update({
      where: { id },
      data,
      include: {
        avatar: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
            reels: true
          }
        }
      }
    })

    return {
      ...user,
      _count: {
        ...user._count,
        total_content: user._count.posts + user._count.reels
      }
    }
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
      include: {
        avatar: true
      }
    })
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        avatar: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
            reels: true
          }
        }
      }
    })

    if (!user) return null

    return {
      ...user,
      _count: {
        ...user._count,
        total_content: user._count.posts + user._count.reels
      }
    }
  }
}

export default new UserRepository()
