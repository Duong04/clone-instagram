import express from 'express'
import routes from '~/routes/index.route'
import errorHandler from '~/middlewares/error.middleware'

const app = express()

app.use(express.json())
app.use('/api/v1', routes)
app.get('/api', (req, res) => {
  res.json({
    message: 'API is running 🚀'
  })
})

app.use(errorHandler)

export default app
