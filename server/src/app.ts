import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from './config/index.js'
import healthRoutes from './routes/health.js'
import userRoutes from './routes/users.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

// Security & logging middleware
app.use(helmet())
app.use(
  cors({
    origin: config.corsOrigin
  })
)
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/health', healthRoutes)
app.use('/api/users', userRoutes)

// Error handling
app.use(notFound)
app.use(errorHandler)

export default app
