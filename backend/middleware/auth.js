import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const protectRoute = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace("Bear", '')

        if (!token) return res.json({ message: 'No auth' })

        const decoded = jwt.verify(token, process.env.JWT_SECERT)

        const user = await User.findById(decoded.userId).select('-password')
        if (!user) return res.json({ message: 'token is not valid' })

        req.user = user
        next()

    } catch (error) {
        console.log(error)
    }
}

export default protectRoute