import userRepository from '~/repositories/user.repository'
import bcrypt from 'bcryptjs'
import { generateAccessToken, generateRefreshToken } from '~/utils/jwt'
import { RegisterInput } from '~/types/user.type'
import { redis } from '~/config/redis'
import { UserAuth } from '~/types/auth.type'

class AuthService {
  async register(data: RegisterInput) {
    const [userExist, userNameExist] = await Promise.all([
      userRepository.findByEmail(data.email),
      userRepository.findByUsername(data.username)
    ])

    if (userExist) throw new Error('Email already exists')
    if (userNameExist) throw new Error('Username already exists')

    const hashedPassword = await bcrypt.hash(data.password, 12)

    const user = await userRepository.create({
      ...data,
      is_active: true,
      avatar: {
        connect: { id: 'default-avatar' }
      },
      password: hashedPassword
    })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      bio: user.bio,
      is_private: user.is_private,
      avatar: {
        url: user.avatar?.url
      }
    }
  }

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email)

    if (!user) {
      throw new Error('Invalid credentials')
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      throw new Error('Invalid credentials')
    }

    const accessToken = generateAccessToken(user.id)
    const refreshToken = await generateRefreshToken(user.id)

    return {
      user: this.formatUserResponse(user),
      accessToken,
      refreshToken
    }
  }

  async profile(userId: string) {
    const user = await userRepository.findById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    return this.formatUserResponse(user)
  }

  async refresh(refreshToken: string) {
    const userId = await redis.get(`refresh:${refreshToken}`)

    if (!userId) {
      throw new Error('Invalid refresh token')
    }

    await redis.del(`refresh:${refreshToken}`)

    const user = await userRepository.findById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    const newAccessToken = generateAccessToken(userId)
    const newRefreshToken = await generateRefreshToken(userId)

    return {
      user: this.formatUserResponse(user),
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  }

  async logout(refreshToken: string) {
    await redis.del(`refresh:${refreshToken}`)
    return { message: 'Logged out' }
  }

  private formatUserResponse(user: UserAuth) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      bio: user.bio,
      website: user.website,
      is_private: user.is_private,
      _count: user._count,
      avatar: {
        url: user.avatar?.url || 'https://res.cloudinary.com/.../default_avatar.jpg'
      }
    }
  }
}

export default new AuthService()
