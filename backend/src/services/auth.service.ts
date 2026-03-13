import userRepository from '~/repositories/user.repository'
import bcrypt from 'bcryptjs'
import { generateAccessToken, generateRefreshToken } from '~/utils/jwt'
import { RegisterInput } from '~/types/user.type'
import { redis } from '~/config/redis'

class AuthService {
  async register(data: RegisterInput) {
    const userExist = await userRepository.findByEmail(data.email)

    if (userExist) {
      throw new Error('Email already exists')
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await userRepository.create({
      ...data,
      password: hashedPassword
    })

    return {
      id: user.id,
      email: user.email,
      name: user.name
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
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      accessToken,
      refreshToken
    }
  }

  async profile(userId: string) {
    const user = await userRepository.findById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
      updated_at: user.updated_at
    }
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
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  }

  async logout(refreshToken: string) {
    await redis.del(`refresh:${refreshToken}`)
    return { message: 'Logged out' }
  }
}

export default new AuthService()
