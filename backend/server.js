import express from 'express'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import cors from 'cors'

import authRoutes from './routes/authRoutes.js'
import bookRoutes from './routes/bookRoutes.js'

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(cors())

connectDB()
connectCloudinary()

app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})