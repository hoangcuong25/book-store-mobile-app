import express from 'express'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = express.Router()

const generateToken = (userId) => {
    jwt.sign({ userId }, process.env.JWT_SECERT)
}

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) return res.json({ message: 'All filed are required' })

        const user = await User.findOne({ email })
        if (!user) return res.json({ message: 'invalid credential' })

        const isPasswordCorrect = await bcrypt.compare(user.password, password)
        if (!isPasswordCorrect) return res.json({ message: 'invalid' })

        const token = generateToken(user._id)

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: email,
                profileImage: user.profileImage
            }
        })
    } catch (error) {
        console.log(error)
    }
})

router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body

        if (!username || !email || !password) {
            return res.json({ message: 'All fields are required' })
        }

        if (password.length < 6) {
            return res.json({ message: 'Password weak' })
        }

        if (username.length < 3) {
            return res.json({ message: 'username invalid' })
        }

        const isUser = await User.findOne({ email })
        if (isUser) {
            return res.json({ message: 'user already exist' })
        }

        const isUsername = await User.findOne({ username })
        if (isUsername) {
            return res.json({ message: 'username already exist' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const user = new User({
            email,
            username,
            password: hashPassword,
        })

        await user.save()

        const token = generateToken(user._id)

        res.json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }
        })

    } catch (error) {
        console.log(error)
    }
})

export default router 