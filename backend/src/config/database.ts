import { PrismaClient } from '~/generated/prisma/client.js'

const prisma = new PrismaClient()

const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect()
    console.log('PostgreSQL connected 🚀')
  } catch (error) {
    console.error('PostgreSQL connection error:', error)
    process.exit(1)
  }
}

export { prisma }
export default connectDB
