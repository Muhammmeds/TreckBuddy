require('dotenv').config()

const jwt = require('jsonwebtoken')
const JourneyUser = require('./models/journeyUserModel')

const protect = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(400).json('Token is required')
    } else if (authorization.startsWith('Bearer')) {
        const token = authorization.split(' ')[1]
        if (!token) {
            return res.status(400).json('No token provided')
        } else {
            try {
                const decoded = jwt.verify(token, process.env.SECRET_KEY)
                if (!decoded) {
                    return res.status(400).json('Invalid token')
                } else {
                    req.user = await JourneyUser.findById(decoded.id).select('-password')
                    next()
                }
            } catch (error) {
                return res.status(400).json('Invalid token')
            }
        }
    }
}

module.exports = protect