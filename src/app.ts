import express from 'express'
const app = express()
import cors from 'cors'
import morgan from 'morgan'
import { config } from './config'
import taskRoutes from './routes/task.routes'   

// Config
app.set('port', config.PORT)

// Middlewares
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Routes
app.use('/api/', taskRoutes)

export default app

