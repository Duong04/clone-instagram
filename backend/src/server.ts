import 'dotenv/config'
import { createServer } from 'http'
import app from '~/app'
import connectDB from '~/config/database'
import { initSocket } from '~/socket'

const PORT = process.env.PORT || 3000

const startServer = async () => {
  await connectDB()

  const server = createServer(app)
  initSocket(server)

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer()
